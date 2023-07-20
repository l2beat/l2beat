import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer } from '@l2beat/uif'
import { setTimeout } from 'timers/promises'
import { BalanceIndexer } from './BalanceIndexer'
import { TvlRepository } from '../repositories/TvlRepository'

export class TvlIndexer extends ChildIndexer {
  constructor(
    logger: Logger,
    balanceIndexer: BalanceIndexer,
    private readonly tvlRepository: TvlRepository,
  ) {
    super(logger, [balanceIndexer])
  }

  override async update(from: number, to: number) {
    await setTimeout(2_000)
    to = Math.min(from + 10, to)
    return to
  }

  override async invalidate() {
    return Promise.resolve()
  }

  override async getSafeHeight() {
    const height = await this.tvlRepository.getLastSynced()
    return height ?? 0
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.tvlRepository.setLastSynced(height)
  }
}
