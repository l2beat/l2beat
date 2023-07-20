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
    await setTimeout(2_000)
    if (Math.random() < 0.5) {
      throw new Error('Random error while updating')
    }
    return to
  }

  override async invalidate(to: number): Promise<void> {
    if (Math.random() < 0.5) {
      throw new Error('Random error while invalidating')
    }
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
