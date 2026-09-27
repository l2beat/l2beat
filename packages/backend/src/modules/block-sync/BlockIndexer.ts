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
 * How far before a batch the settled ranges of its blocks may begin. Logs are
 * fetched from that far back so the ranges can be rebuilt, see
 * `onlyConsistent`. Avalanche settles a block within about fifteen heights.
 */
const SETTLEMENT_LOOKBACK = 32

export class BlockIndexer extends ManagedChildIndexer {
  /**
   * Set once a header with `settledHeight` was seen: the chain executes
   * asynchronously and settles its blocks a few heights later.
   */
  private settlesAsynchronously = false

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

    const logsFrom = this.settlesAsynchronously
      ? Math.max(adjustedFrom - SETTLEMENT_LOOKBACK, 0)
      : adjustedFrom

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
        this.settlesAsynchronously ||= blocks.some(
          (block) => block.settledHeight !== undefined,
        )
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
    let lastProcessedBlockNumber: number | undefined
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
        if (lastProcessedBlockNumber === undefined) {
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
      lastProcessedBlockNumber = block.number
    }
    const processingDuration = Date.now() - processingStart
    this.logger.info('Processed blocks', {
      chain: this.$.source,
      blocks: processedBlocks,
      logs: processedLogs,
      processors: this.$.blockProcessors.length,
      durationMs: Number.parseFloat(processingDuration.toFixed(2)),
    })

    return lastProcessedBlockNumber ?? actualTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
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
