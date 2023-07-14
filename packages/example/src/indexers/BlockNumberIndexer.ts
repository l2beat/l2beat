import { ChildIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { FakeClockIndexer } from './FakeClockIndexer'
import { setTimeout } from 'timers/promises'

export class BlockNumberIndexer extends ChildIndexer {
  constructor(
    logger: Logger,
    fakeClockIndexer: FakeClockIndexer,
    private readonly blockNumberRepository: BlockNumberRepository,
  ) {
    super(logger, [fakeClockIndexer])
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

  override async getSafeHeight(): Promise<number> {
    const height = await this.blockNumberRepository.getLastSynced()
    return height ?? 0
  }

  override async setSafeHeight(height: number): Promise<void> {
    return this.blockNumberRepository.setLastSynced(height)
  }
}
