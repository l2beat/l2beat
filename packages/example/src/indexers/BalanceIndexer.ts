import { ChildIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

import { setTimeout } from 'timers/promises'

import { BalanceRepository } from '../repositories/BalanceRepository'
import { BlockNumberIndexer } from './BlockNumberIndexer'

export class BalanceIndexer extends ChildIndexer {
  constructor(
    logger: Logger,
    blockNumberIndexer: BlockNumberIndexer,
    private readonly balanceRepository: BalanceRepository,
  ) {
    super(logger, [blockNumberIndexer])
  }

  override async update(from: number, to: number): Promise<number> {
    this.logger.info('Update started')
    await setTimeout(1_000)
    if(Math.random() < 0.1) {
      this.logger.info('BalanceIndexer: height decreased')
      return Math.max(from - 5, 0)
    }
    to = Math.min(from + 5, to)
    return to
  }

  override async invalidate(): Promise<void> {
    this.logger.info('Invalidate started')
    return Promise.resolve()
  }

  override async getSafeHeight(): Promise<number> {
    const height = await this.balanceRepository.getLastSynced()
    return height ?? 0
  }

  override async setSafeHeight(height: number): Promise<void> {
    return this.balanceRepository.setLastSynced(height)
  }
}
