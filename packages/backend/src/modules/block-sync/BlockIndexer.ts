import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'
import type { BlockProcessor } from '../types'

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
    this.logger.info(`Delay from the tip: ${delay} blocks`, { delay })

    const adjustedTo = Math.min(to, adjustedFrom + this.$.batchSize - 1)

    this.logger.info('Range adjusted', {
      from: adjustedFrom,
      to: adjustedTo,
      mode: this.$.mode,
    })

    const blockNumbers = []
    for (
      let blockNumber = adjustedFrom;
      blockNumber <= adjustedTo;
      blockNumber++
    ) {
      blockNumbers.push(blockNumber)
    }

    this.logger.info('Fetching all blocks and logs', {
      from: adjustedFrom,
      to: adjustedTo,
      blocks: adjustedTo - adjustedFrom + 1,
    })

    const start = Date.now()
    const blockData = await Promise.all(
      blockNumbers.map(async (blockNumber) => {
        const [block, logs] = await Promise.all([
          this.$.blockProvider.getBlockWithTransactions(blockNumber),
          this.$.logsProvider.getLogs(blockNumber, blockNumber),
        ])
        return { blockNumber, block, logs }
      }),
    )
    const totalDuration = Date.now() - start
    this.logger.info('Finished fetching all blocks and logs', {
      totalDuration,
      blocks: blockData.length,
    })

    for (const { blockNumber, block, logs } of blockData) {
      for (const processor of this.$.blockProcessors) {
        try {
          const start = Date.now()
          await processor.processBlock(block, logs)
          const duration = Date.now() - start
          this.logger.info(
            `${processor.constructor.name} finished in ${duration.toFixed(2)}ms`,
            { processor: processor.constructor.name, duration },
          )
        } catch (error) {
          this.logger.error(
            `Processor ${processor.constructor.name} failed to process block`,
            { blockNumber, error },
          )
        }
      }
    }

    return adjustedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
