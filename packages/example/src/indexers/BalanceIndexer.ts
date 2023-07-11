import { BaseIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

import { BalanceRepository } from '../repositories/BalanceRepository'
import { BlockNumberIndexer } from './BlockNumberIndexer'

export class BalanceIndexer extends BaseIndexer {
  constructor(
    logger: Logger,
    private readonly blockNumberIndexer: BlockNumberIndexer,
    private readonly balanceRepository: BalanceRepository,
  ) {
    super(logger, [blockNumberIndexer])
  }

  override async start(): Promise<void> {
    this.logger.info('Started')
    return Promise.resolve()
  }

  override async update(from: number, to: number): Promise<number> {
    this.logger.info('Update started')
    await Promise.resolve()
    to = Math.min(from + 5, to)
    return to
  }

  override async invalidate(): Promise<void> {
    this.logger.info('Invalidate started')
    return Promise.resolve()
  }

  override async setHeight(height: number): Promise<void> {
    this.logger.info('setHeight started')
    return Promise.resolve()
  }
}
