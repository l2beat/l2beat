import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import type { Block, Log } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'
import type { BlockProcessor } from '../types'
import { withBlockSyncRpcMetricsContext } from './blockSyncRpcMetrics'

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

export class BlockIndexer extends ManagedChildIndexer {
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
          this.$.logsProvider.getLogs(adjustedFrom, adjustedTo),
        ])
        // Receipt confirmations issued here share the fetch metrics context.
        return await onlyConsistent(blocks, logs, (block) =>
          this.confirmNoLogs(block),
        )
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
   * Used only for blocks whose header logsBloom cannot vouch for the block
   * (see `onlyConsistent`). A block with transactions and no logs is accepted
   * when every receipt exists, belongs to this block and carries no logs.
   */
  private async confirmNoLogs(block: Block): Promise<boolean> {
    const hashes = block.transactions.flatMap((tx) =>
      tx.hash ? [tx.hash] : [],
    )
    if (hashes.length !== block.transactions.length) {
      this.logger.warn('Cannot confirm empty block, transaction hash missing', {
        blockNumber: block.number,
      })
      return false
    }

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
  }
}

/*
There are two cases where logs can become inconsistent with blocks.
1) A reorg happened in between the requests and log hashes don't match block hashes
2) The node has block headers but doesn't yet have the logs

In order to guarantee that the logs we're getting belong to the blocks we're getting
we need to check that:
1) The log hashes match the block hashes (reorg protection)
2) If and only if the logsBloom is empty there are no logs (no logs protection)

On chains with asynchronous execution (Avalanche C-Chain since Helicon, ACP-194)
the header logsBloom describes the receipts of the blocks settled by the block,
not the block itself, so check 2 is impossible there. Such blocks are recognised
by `settledHeight` and, when they have transactions but no logs, are confirmed
through their receipts instead.
*/
const LOGS_BLOOM_ZERO = `0x${'0'.repeat(512)}`
export async function onlyConsistent(
  blocks: Block[],
  logs: Log[],
  confirmNoLogs: (block: Block) => Promise<boolean>,
) {
  const result: { block: Block; logs: Log[] }[] = []
  for (const block of blocks) {
    const blockLogs = logs.filter((l) => l.blockHash === block.hash)

    if (!(await isConsistent(block, blockLogs, confirmNoLogs))) {
      break
    }

    result.push({ block, logs: blockLogs })
  }
  return result
}

async function isConsistent(
  block: Block,
  blockLogs: Log[],
  confirmNoLogs: (block: Block) => Promise<boolean>,
): Promise<boolean> {
  if (blockLogs.length > 0) {
    return true // blockLogs are already matched by hash
  }
  if (block.settledHeight === undefined) {
    // https://polygonscan.com/block/79061984 this block has logs bloom ZERO - although it has transaction with 10 logs.
    // This broke our validation logic. We decided to update our validation scheme to accommodate this issue.
    return block.logsBloom === LOGS_BLOOM_ZERO
  }
  if (block.transactions.length === 0) {
    return true
  }
  return await confirmNoLogs(block)
}
