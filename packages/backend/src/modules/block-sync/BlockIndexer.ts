import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import type { Block, Log } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'
import type { BlockProcessor } from '../types'

export interface BlockIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  source: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  blockProcessors: BlockProcessor[]
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
}

export class BlockIndexer extends ManagedChildIndexer {
  constructor(private readonly $: BlockIndexerDeps) {
    super({
      ...$,
      name: 'block_indexer',
      tags: {
        tag: $.source,
        project: $.source,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    let adjustedFrom = from
    if (adjustedFrom !== to && from === this.$.minHeight) {
      adjustedFrom = to
    }
    const adjustedTo = Math.min(to, adjustedFrom + this.$.batchSize - 1)

    const blockNumbers = []
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

    const [blocks, logs] = await Promise.all([
      Promise.all(
        blockNumbers.map((n) =>
          this.$.blockProvider.getBlockWithTransactions(n),
        ),
      ),
      this.$.logsProvider.getLogs(adjustedFrom, adjustedTo),
    ])
    const consistentBlocks = onlyConsistent(blocks, logs)
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

    for (const { block, logs } of consistentBlocks) {
      for (const processor of this.$.blockProcessors) {
        try {
          const start = Date.now()
          await processor.processBlock(block, logs)
          const duration = Date.now() - start
          this.logger.info('Processor finished', {
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
      this.logger.info('Processed block', {
        blockNumber: block.number,
        logs: logs.length,
      })
    }

    return actualTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
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
*/
const LOGS_BLOOM_ZERO = `0x${'0'.repeat(512)}`
export function onlyConsistent(blocks: Block[], logs: Log[]) {
  const result: { block: Block; logs: Log[] }[] = []
  for (const block of blocks) {
    const blockLogs = logs.filter((l) => l.blockHash === block.hash)
    const hasLogs = blockLogs.length > 0
    const shouldHaveLogs = block.logsBloom !== LOGS_BLOOM_ZERO
    if (hasLogs !== shouldHaveLogs) {
      break
    }
    result.push({ block, logs: blockLogs })
  }
  return result
}
