import type { Logger } from '@l2beat/backend-tools'
import { ChildIndexer, type IndexerOptions } from '@l2beat/uif'

import type { HourlyIndexer } from '../HourlyIndexer'
import { ONE_HOUR_MS } from '../utils'
import type { BlockIndexerRepository } from './BlockIndexerRepository'
import type { BlockRepository } from './BlockRepository'
import type { BlockService } from './BlockService'

export class BlockIndexer extends ChildIndexer {
  constructor(
    private readonly blockService: BlockService,
    private readonly blockRepository: BlockRepository,
    private readonly blockIndexerRepository: BlockIndexerRepository,
    private readonly minHeight: number,
    hourlyIndexer: HourlyIndexer,
    logger: Logger,
    options?: IndexerOptions,
  ) {
    super(logger, [hourlyIndexer], options)
  }

  override async initialize() {
    const height = await this.blockIndexerRepository.loadHeight()
    return { safeHeight: height ?? this.minHeight - 1 }
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.blockIndexerRepository.saveHeight(height)
  }

  override async setInitialState(
    safeHeight: number,
    configHash?: string | undefined,
  ) {
    await this.blockIndexerRepository.upsert({
      indexerId: 'block_indexer',
      height: safeHeight,
      configHash,
    })
  }

  override async update(from: number): Promise<number> {
    const timestamp = from * ONE_HOUR_MS

    const block = await this.blockService.getBlockNumberBefore(timestamp)
    await this.blockRepository.save({ number: block, timestamp })

    return from
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // We don't need to delete any data
    return await Promise.resolve(targetHeight)
  }
}
