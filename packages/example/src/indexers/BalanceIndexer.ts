import { BaseIndexer, Logger } from '@l2beat/uif'

import { BalanceRepository } from '../repositories/BalanceRepository'
import { BlockNumberIndexer } from './BlockNumberIndexer'

export class BalanceIndexer extends BaseIndexer {
  constructor(
    logger: Logger,
    private readonly blockNumberIndexer: BlockNumberIndexer,
    private readonly balanceRepository: BalanceRepository,
  ) {
    super(logger, [blockNumberIndexer], {}, { batchSize: 1 })
    this.logger = this.logger.for(this)
  }

  override async start(): Promise<void> {
    this.logger.info('BalanceIndexer started')
    return Promise.resolve()
  }

  async update(): Promise<void> {
    this.logger.info('BalanceIndexer update started')
    return Promise.resolve()
  }
}
