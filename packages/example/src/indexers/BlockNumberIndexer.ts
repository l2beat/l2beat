import { BaseIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { ClockIndexer } from './ClockIndexer'
import { setTimeout } from 'timers/promises'

export class BlockNumberIndexer extends BaseIndexer {
  constructor(
    logger: Logger,
    private readonly clockIndexer: ClockIndexer,
    private readonly blockNumberRepository: BlockNumberRepository,
  ) {
    super(logger, [clockIndexer])
  }

  override async update(from: number, to: number): Promise<number> {
    this.logger.info('Update started')
    await setTimeout(3_000)
    return to
  }

  override async invalidate(): Promise<void> {
    this.logger.info('Invalidate started')
    return Promise.resolve()
  }

  override async getHeight(): Promise<number> {
    const height = await this.blockNumberRepository.getLastSynced()
    return height ?? 0
  }

  override async setHeight(height: number): Promise<void> {
    return this.blockNumberRepository.setLastSynced(height)
  }
}
