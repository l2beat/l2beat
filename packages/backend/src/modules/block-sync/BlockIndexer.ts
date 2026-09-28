import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import type { Block } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'
import type { BlockProcessor } from '../types'
import { withBlockSyncRpcMetricsContext } from './blockSyncRpcMetrics'
import { onlyConsistent } from './consistentBlocks'

export interface BlockIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  source: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  blockProcessors: BlockProcessor[]
  stopBlockIndexerAtTimestampMs?: number
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
}

/**
 * Upper bound on how far before a batch logs are fetched to rebuild settled
 * ranges, see `lastProcessed`. Ranges reaching further back fall back to
 * receipts. Avalanche settles a block within about fifteen heights.
 */
const MAX_SETTLEMENT_LOOKBACK = 32

export class BlockIndexer extends ManagedChildIndexer {
  /**
   * The last processed block. On chains that execute asynchronously every
   * settled range a following batch can rebuild starts after its
   * `settledHeight`, so logs are fetched from there, see `onlyConsistent`.
   */
  private lastProcessed: Pick<Block, 'number' | 'settledHeight'> | undefined

  constructor(
    private readonly $: BlockIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: 'block_indexer',
        tags: {
          tag: $.source,
          chain: $.source,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    let adjustedFrom = from
    if (adjustedFrom !== to && from === this.$.minHeight) {
      adjustedFrom = to
    }
    const adjustedTo = Math.min(to, adjustedFrom + this.$.batchSize - 1)

    const blockNumbers: number[] = []
    for (
      let blockNumber = adjustedFrom;
      blockNumber <= adjustedTo;
      blockNumber++
    ) {
      blockNumbers.push(blockNumber)
    }

    const logsFrom = this.getLogsFrom(adjustedFrom)

    const start = Date.now()

    this.logger.info('Fetching blocks and logs', {
      blocks: to - adjustedFrom,
      from: adjustedFrom,
      to: adjustedTo,
      count: adjustedTo - adjustedFrom + 1,
    })

    const consistentBlocks = await withBlockSyncRpcMetricsContext(
      'blockSync.fetch',
      {
        chain: this.$.source,
      },
      async () => {
        const [blocks, logs] = await Promise.all([
          Promise.all(
            blockNumbers.map((n) =>
              this.$.blockProvider.getBlockWithTransactions(n),
            ),
          ),
          this.$.logsProvider.getLogs(logsFrom, adjustedTo),
        ])
        return await onlyConsistent({
          blocks,
          logs,
          logsFromBlock: logsFrom,
          confirmNoLogs: (block) => this.confirmNoLogs(block),
        })
      },
    )
    if (consistentBlocks.length === 0) {
      this.logger.info("Couldn't get consistent blocks & logs", {
        from: adjustedFrom,
        to: adjustedTo,
      })
      throw new Error("Couldn't get consistent blocks & logs")
    }
    const actualTo = consistentBlocks[consistentBlocks.length - 1].block.number

    const totalDuration = Date.now() - start
    this.logger.info('Fetched blocks and logs', {
      totalDuration,
      from: adjustedFrom,
      to: actualTo,
      count: consistentBlocks.length,
    })

    const processingStart = Date.now()
    const stopBlockIndexerAtTimestampMs = this.$.stopBlockIndexerAtTimestampMs
    let processedBlocks = 0
    let processedLogs = 0
    let lastProcessedBlock: Block | undefined
    for (const { block, logs } of consistentBlocks) {
      const blockTimestampMs = block.timestamp
      if (
        stopBlockIndexerAtTimestampMs !== undefined &&
        blockTimestampMs > stopBlockIndexerAtTimestampMs
      ) {
        this.logger.info('Stopping block sync at configured timestamp', {
          blockNumber: block.number,
          blockTimestampMs,
          stopBlockIndexerAtTimestampMs,
        })
        if (lastProcessedBlock === undefined) {
          throw new Error(
            `Block ${block.number} timestamp (${blockTimestampMs}) is greater than STOP_BLOCK_INDEXER_AT_TIMESTAMP_MS (${stopBlockIndexerAtTimestampMs})`,
          )
        }
        break
      }

      for (const processor of this.$.blockProcessors) {
        try {
          const start = Date.now()
          await withBlockSyncRpcMetricsContext(
            'blockSync.process',
            {
              chain: this.$.source,
            },
            () => processor.processBlock(block, logs),
          )
          const duration = Date.now() - start
          this.logger.debug('Processor finished', {
            processor: processor.constructor.name,
            durationMs: Number.parseFloat(duration.toFixed(2)),
          })
        } catch (error) {
          this.logger.error('Processor failed', {
            processor: processor.constructor.name,
            blockNumber: block.number,
            error,
          })
        }
      }
      this.logger.debug('Processed block', {
        blockNumber: block.number,
        logs: logs.length,
      })
      processedBlocks++
      processedLogs += logs.length
      lastProcessedBlock = block
    }
    const processingDuration = Date.now() - processingStart
    this.logger.info('Processed blocks', {
      chain: this.$.source,
      blocks: processedBlocks,
      logs: processedLogs,
      processors: this.$.blockProcessors.length,
      durationMs: Number.parseFloat(processingDuration.toFixed(2)),
    })

    if (lastProcessedBlock) {
      this.lastProcessed = {
        number: lastProcessedBlock.number,
        settledHeight: lastProcessedBlock.settledHeight,
      }
    }
    return lastProcessedBlock?.number ?? actualTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }

  /**
   * Without a `settledHeight` right before the batch (synchronous chain,
   * first batch after a restart) the logs of the batch itself are enough.
   */
  private getLogsFrom(from: number): number {
    const previous = this.lastProcessed
    if (previous?.number !== from - 1 || previous.settledHeight === undefined) {
      return from
    }
    return Math.min(
      from,
      Math.max(previous.settledHeight + 1, from - MAX_SETTLEMENT_LOOKBACK),
    )
  }

  /**
   * Last resort for a block with transactions but no logs that no settled
   * range vouches for, see `onlyConsistent`. The block is accepted when every
   * receipt exists, belongs to it and carries no logs. A failed lookup only
   * stops the batch at this block, the blocks before it stay processed.
   */
  private async confirmNoLogs(block: Block): Promise<boolean> {
    const hashes = block.transactions.flatMap((tx) =>
      tx.hash ? [tx.hash] : [],
    )
    if (hashes.length !== block.transactions.length) {
      this.logger.warn('Cannot confirm block without logs, tx hash missing', {
        blockNumber: block.number,
      })
      return false
    }

    try {
      const receipts = await Promise.all(
        hashes.map((hash) => this.$.blockProvider.getTransactionReceipt(hash)),
      )
      const confirmed = receipts.every(
        (receipt) =>
          receipt.blockHash === block.hash && receipt.logs.length === 0,
      )
      this.logger.info('Confirmed block without logs via receipts', {
        blockNumber: block.number,
        transactions: hashes.length,
        confirmed,
      })
      return confirmed
    } catch (error) {
      this.logger.warn('Failed to confirm block without logs via receipts', {
        blockNumber: block.number,
        error,
      })
      return false
    }
  }
}
