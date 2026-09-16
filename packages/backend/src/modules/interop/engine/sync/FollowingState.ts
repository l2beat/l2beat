import type { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps } from '@l2beat/database'
import { type Block, type Log, UnixTime } from '@l2beat/shared-pure'
import { CatchingUpState } from './CatchingUpState'
import type {
  BlockProcessorState,
  InteropEventSyncer,
  SyncerState,
} from './InteropEventSyncer'

// Resync and wipe requests come from the backoffice. They are honoured by
// CatchingUpState, so noticing them a few seconds late only costs a few more
// rows in a range that is about to be replaced. The check cannot rely on the
// checkStatus tick alone: that tick is skipped while a block is being processed.
const RESYNC_CHECK_INTERVAL_MS = 10_000

export class FollowingState implements BlockProcessorState {
  type = 'blockProcessor' as const
  name = 'following'
  status = 'starting'

  // The syncer is the only writer of its synced range while following, so the
  // last committed range is kept here instead of being read for every block.
  // Catch-up and wipe both go through CatchingUpState, which creates a new
  // FollowingState afterwards and thereby drops this cache.
  private syncedRangeLoaded = false
  private syncedRange?: BlockRangeWithTimestamps
  private resyncCheckedAt = Number.NEGATIVE_INFINITY

  constructor(
    private readonly syncer: InteropEventSyncer,
    private readonly logger: Logger,
  ) {}

  async checkStatus(): Promise<SyncerState> {
    if (await this.isResyncRequested()) {
      return new CatchingUpState(this.syncer, this.logger)
    }

    this.status = 'idle'
    return this
  }

  async processNewestBlock(block: Block, logs: Log[]): Promise<SyncerState> {
    this.status = 'processing'

    const start = performance.now()
    let cpuMs = 0
    try {
      const resyncCheckDue =
        Date.now() - this.resyncCheckedAt >= RESYNC_CHECK_INTERVAL_MS
      if (resyncCheckDue && (await this.isResyncRequested())) {
        return new CatchingUpState(this.syncer, this.logger)
      }

      const decision = decideFollowingAction({
        lastSyncedRecord: await this.getSyncedRange(),
        blockNumber: BigInt(block.number),
        blockTimestamp: block.timestamp,
      })

      if (decision.type === 'catchUp') {
        return new CatchingUpState(this.syncer, this.logger)
      }

      if (decision.type === 'ignore') {
        this.status = 'idle'
        return this
      }

      const updatedSyncedRange =
        decision.type === 'bootstrap'
          ? await this.bootstrapSyncedRange(block)
          : decision.updatedSyncedRange

      const historical = await this.syncer.capturePendingHistoricalTxs(
        BigInt(block.number),
      )
      const cpuStart = performance.now()
      const interopEvents = [...historical.events]
      const fulfilledCreatorEvents = [...historical.fulfilledCreatorEvents]
      const checkedInHistoryEvents = [...historical.checkedInHistoryEvents]
      const toCapture = this.syncer.getItemsToCapture(block, logs)
      for (const txToCapture of toCapture.txsToCapture) {
        const result = this.syncer.captureTx(txToCapture)
        if (result) {
          interopEvents.push(...result.events)
          fulfilledCreatorEvents.push(...result.fulfilledCreatorEvents)
        }
      }
      for (const logToCapture of toCapture.logsToCapture) {
        const produced = this.syncer.captureLog(logToCapture)
        if (produced) {
          interopEvents.push(...produced)
        }
      }
      cpuMs = performance.now() - cpuStart

      await this.syncer.saveProducedInteropEvents(
        interopEvents,
        updatedSyncedRange,
        fulfilledCreatorEvents,
        checkedInHistoryEvents,
      )
      this.syncedRange = updatedSyncedRange

      this.status = 'idle'
      return this
    } finally {
      this.syncer.blockProcessingStats.record(performance.now() - start, cpuMs)
    }
  }

  private async isResyncRequested(): Promise<boolean> {
    const { resyncFrom, wipeRequired } = await this.syncer.getResyncState()
    this.resyncCheckedAt = Date.now()
    return wipeRequired || resyncFrom !== undefined
  }

  private async getSyncedRange(): Promise<
    BlockRangeWithTimestamps | undefined
  > {
    if (!this.syncedRangeLoaded) {
      this.syncedRange = await this.syncer.getLastSyncedRange()
      this.syncedRangeLoaded = true
    }
    return this.syncedRange
  }

  // If Syncer runs for the first time on existing data,
  // try to figure out already synced range
  private async bootstrapSyncedRange(
    incomingBlock: Block,
  ): Promise<BlockRangeWithTimestamps> {
    const oldestEvent = await this.syncer.getOldestEventForPluginAndChain()
    return oldestEvent
      ? {
          fromBlock: BigInt(oldestEvent.blockNumber),
          fromTimestamp: oldestEvent.timestamp,
          toBlock: BigInt(incomingBlock.number),
          toTimestamp: UnixTime(incomingBlock.timestamp),
        }
      : {
          fromBlock: BigInt(incomingBlock.number),
          fromTimestamp: UnixTime(incomingBlock.timestamp),
          toBlock: BigInt(incomingBlock.number),
          toTimestamp: UnixTime(incomingBlock.timestamp),
        }
  }
}

export type FollowingDecision =
  | { type: 'catchUp' }
  | { type: 'ignore' }
  | { type: 'bootstrap' }
  | { type: 'process'; updatedSyncedRange: BlockRangeWithTimestamps }

export function decideFollowingAction(params: {
  lastSyncedRecord?: BlockRangeWithTimestamps
  blockNumber: bigint
  blockTimestamp: UnixTime
}): FollowingDecision {
  if (!params.lastSyncedRecord) {
    return { type: 'bootstrap' } // Looks like a first run ever, see if we already are synced
  }

  if (params.lastSyncedRecord.toBlock < params.blockNumber - 1n) {
    return { type: 'catchUp' } // Catch up to the current block first
  }

  if (params.lastSyncedRecord.toBlock >= params.blockNumber) {
    return { type: 'ignore' } // We're already synced futher, wait...
  }

  return {
    type: 'process',
    updatedSyncedRange: {
      fromBlock: params.lastSyncedRecord.fromBlock,
      fromTimestamp: params.lastSyncedRecord.fromTimestamp,
      toBlock: params.blockNumber,
      toTimestamp: params.blockTimestamp,
    },
  }
}
