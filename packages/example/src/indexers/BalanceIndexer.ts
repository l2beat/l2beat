import { BaseIndexer, Logger } from '@l2beat/uif'

import { BalanceRepository } from '../repositories/BalanceRepository'
import { BlockNumberIndexer } from './BlockNumberIndexer'

export class BalanceIndexer extends BaseIndexer {
  constructor(
    logger: Logger,
    private readonly blockNumberIndexer: BlockNumberIndexer,
    private readonly balanceRepository: BalanceRepository,
  ) {
    super(logger, [blockNumberIndexer], {}, { batchSize: Infinity })
  }

  override async start(): Promise<void> {
    this.logger.info('Started')
    return Promise.resolve()
  }

  async update(): Promise<void> {
    this.logger.info('Update started')
    return Promise.resolve()
  }

  override async setHeight(height: number): Promise<void> {
    this.logger.info('setHeight started')
    return Promise.resolve()
  }
}
