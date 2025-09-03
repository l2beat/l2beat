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
    let blockNumber = from
    if (
      blockNumber !== to &&
      (from === this.$.minHeight || this.$.mode === 'LATEST_ONLY')
    ) {
      blockNumber = to
    }

    const delay = to - blockNumber
    this.logger.info(`Delay from the tip: ${delay} blocks`, { delay })

    this.logger.info('Fetching block and logs', { blockNumber })
    const start = Date.now()
    const block =
      await this.$.blockProvider.getBlockWithTransactions(blockNumber)
    const logs = await this.$.logsProvider.getLogs(blockNumber, blockNumber)
    const duration = Date.now() - start
    this.logger.info('Fetched', {
      duration,
      transactionsCount: block.transactions.length,
      logsCount: logs.length,
    })

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

    return blockNumber
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
