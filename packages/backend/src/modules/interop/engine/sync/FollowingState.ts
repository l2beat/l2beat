import type { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps } from '@l2beat/database'
import { type Block, type Log, UnixTime } from '@l2beat/shared-pure'
import { getItemsToCapture } from '../capture/getItemsToCapture'
import { CatchingUpState } from './CatchingUpState'
import type {
  BlockProcessorState,
  InteropEventSyncer,
  SyncerState,
} from './InteropEventSyncer'

export class FollowingState implements BlockProcessorState {
  type = 'blockProcessor' as const
  name = 'following'
  status = 'starting'

  constructor(
    private readonly syncer: InteropEventSyncer,
    private readonly logger: Logger,
  ) {}

  async processNewestBlock(block: Block, logs: Log[]): Promise<SyncerState> {
    const blockNumber = BigInt(block.number)
    this.syncer.latestBlockNumber = blockNumber

    if ((await this.syncer.isResyncRequestedFrom()) !== undefined) {
      // CatchingUp state takes care of resync requests
      return new CatchingUpState(this.syncer, this.logger)
    }

    const lastSyncedRecord =
      await this.syncer.db.interopPluginSyncedRange.findByPluginNameAndChain(
        this.syncer.plugin.name,
        this.syncer.chain,
      )

    let updatedSyncedRange: BlockRangeWithTimestamps
    if (lastSyncedRecord) {
      if (lastSyncedRecord.toBlock < blockNumber - 1n) {
        // We need to catch up first
        return new CatchingUpState(this.syncer, this.logger)
      }

      if (lastSyncedRecord.toBlock >= blockNumber) {
        return this // ignore and wait, we're already synced further than this block
      }

      updatedSyncedRange = {
        fromBlock: lastSyncedRecord.fromBlock,
        fromTimestamp: lastSyncedRecord.fromTimestamp,
        toBlock: blockNumber,
        toTimestamp: block.timestamp,
      }
    } else {
      updatedSyncedRange = await this.bootstrapSyncedRange(block)
    }

    const interopEvents = []
    const toCapture = getItemsToCapture(this.syncer.chain, block, logs)
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

    return this
  }

  // If Syncer runs for the first time on existing data,
  // try to figure out already synced range
  private async bootstrapSyncedRange(
    incomingBlock: Block,
  ): Promise<BlockRangeWithTimestamps> {
    const oldestEvent =
      await this.syncer.db.interopEvent.getOldestEventForPluginAndChan(
        this.syncer.plugin.name,
        this.syncer.chain,
      )
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
