import type { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps } from '@l2beat/database'
import { type Block, type Log, UnixTime } from '@l2beat/shared-pure'
import { CatchingUpState } from './CatchingUpState'
import type {
  BlockProcessorState,
  InteropEventSyncer,
  SyncerState,
  TimeloopState,
} from './InteropEventSyncer'

export class FollowingState implements BlockProcessorState, TimeloopState {
  type = 'hybrid' as const
  name = 'following'
  status = 'starting'

  constructor(
    private readonly syncer: InteropEventSyncer,
    private readonly logger: Logger,
  ) {}

  async run(): Promise<SyncerState> {
    if (this.status === 'processing') {
      return this
    }

    this.status = 'checking resync'
    const resyncRequested =
      (await this.syncer.isResyncRequestedFrom()) !== undefined
    if (resyncRequested) {
      return new CatchingUpState(this.syncer, this.logger)
    }

    this.status = 'idle'
    return this
  }

  async processNewestBlock(block: Block, logs: Log[]): Promise<SyncerState> {
    this.status = 'processing'

    const resyncRequested =
      (await this.syncer.isResyncRequestedFrom()) !== undefined
    const lastSyncedRecord = resyncRequested
      ? undefined
      : await this.syncer.getLastSyncedRange()

    const decision = decideFollowingAction({
      resyncRequested,
      lastSyncedRecord,
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

    const interopEvents = []
    const toCapture = this.syncer.getItemsToCapture(block, logs)
    for (const logToCapture of toCapture.logsToCapture) {
      const produced = this.syncer.captureLog(logToCapture)
      if (produced) {
        interopEvents.push(produced)
      }
    }

    await this.syncer.saveProducedInteropEvents(
      interopEvents.flat(),
      updatedSyncedRange,
    )

    this.syncer.clearChainSyncError()
    this.status = 'idle'
    return this
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
  resyncRequested: boolean
  lastSyncedRecord?: BlockRangeWithTimestamps
  blockNumber: bigint
  blockTimestamp: UnixTime
}): FollowingDecision {
  if (params.resyncRequested) {
    return { type: 'catchUp' } // CatchingUp state takes care of resync requests
  }

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
