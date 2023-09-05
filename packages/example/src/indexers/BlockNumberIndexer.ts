import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer, Retries } from '@l2beat/uif'
import { setTimeout } from 'timers/promises'

import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { FakeClockIndexer } from './FakeClockIndexer'

export class BlockNumberIndexer extends ChildIndexer {
  constructor(
    logger: Logger,
    fakeClockIndexer: FakeClockIndexer,
    private readonly blockNumberRepository: BlockNumberRepository,
  ) {
    super(logger, [fakeClockIndexer], {
      updateRetryStrategy: Retries.exponentialBackOff({
        initialTimeoutMs: 100,
        maxAttempts: 10,
      }),
    })
  }

  override async update(from: number, targetHeight: number): Promise<number> {
    await setTimeout(2_000)
    if (Math.random() < 0.5) {
      throw new Error('Random error while updating')
    }
    return targetHeight
  }

  override async invalidate(targetHeight: number): Promise<number> {
    if (Math.random() < 0.5) {
      throw new Error('Random error while invalidating')
    }
    return Promise.resolve(targetHeight)
  }

  override async getSafeHeight(): Promise<number> {
    const height = await this.blockNumberRepository.getLastSynced()
    return height ?? 0
  }

  override async setSafeHeight(height: number): Promise<void> {
    return this.blockNumberRepository.setLastSynced(height)
  }
}
