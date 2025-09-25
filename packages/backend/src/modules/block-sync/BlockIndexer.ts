import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'
import type { BlockProcessor } from '../types'
import { Block, Log } from '@l2beat/shared-pure'

export type BlockIndexerMode = `CONTINUOUS` | `LATEST_ONLY`

export interface BlockIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  mode: BlockIndexerMode
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
    if (
      adjustedFrom !== to &&
      (from === this.$.minHeight || this.$.mode === 'LATEST_ONLY')
    ) {
      adjustedFrom = to
    }

    const delay = to - adjustedFrom
    this.logger.info('Delay from the tip', { blocks: delay })

    const adjustedTo = Math.min(to, adjustedFrom + this.$.batchSize - 1)

    const blockNumbers = []
    for (
      let blockNumber = adjustedFrom;
      blockNumber <= adjustedTo;
      blockNumber++
    ) {
      blockNumbers.push(blockNumber)
    }

    this.logger.info('Fetching blocks and logs', {
      from: adjustedFrom,
      to: adjustedTo,
      count: adjustedTo - adjustedFrom + 1,
      mode: this.$.mode,
    })

    const start = Date.now()

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
      throw new Error("Couldn't get consistent blocks & logs")
    }
    const actualTo = consistentBlocks[consistentBlocks.length - 1].blockNumber

    const totalDuration = Date.now() - start
    this.logger.info('Fetched blocks and logs', {
      totalDuration,
      from: adjustedFrom,
      to: actualTo,
      count: consistentBlocks.length,
    })

    for (const { blockNumber, block, logs } of consistentBlocks) {
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
            blockNumber,
            error,
          })
        }
      }
      this.logger.info('Processed block', { blockNumber, logs: logs.length })
    }

    return actualTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}

function onlyConsistent(blocks: Block[], logs: Log[]) {
  return blocks.map((b) => ({
    blockNumber: b.number,
    block: b,
    logs: logs.filter((l) => l.blockNumber === b.number),
  }))
}
