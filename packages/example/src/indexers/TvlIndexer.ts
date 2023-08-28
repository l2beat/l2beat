import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer } from '@l2beat/uif'
import { setTimeout } from 'timers/promises'
import { TvlRepository } from '../repositories/TvlRepository'
import { BalanceIndexer } from './BalanceIndexer'

export class TvlIndexer extends ChildIndexer {
  height = 0

  constructor(
    logger: Logger,
    balanceIndexer: BalanceIndexer,
    private readonly tvlRepository: TvlRepository,
  ) {
    super(logger, [balanceIndexer])
  }

  override async update(from: number, to: number) {
    await setTimeout(500)
    to = Math.min(from + 10, to)
    this.height = to
    return to
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const newHeight = Math.max(this.height - 5, targetHeight)
    this.height = newHeight
    return await Promise.resolve(newHeight)
  }

  override async getSafeHeight() {
    const height = await this.tvlRepository.getLastSynced()
    return height ?? 0
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.tvlRepository.setLastSynced(height)
  }
}
