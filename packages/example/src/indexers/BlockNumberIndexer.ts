import { BaseIndexer, Logger } from '@l2beat/uif'

import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { ClockIndexer } from './ClockIndexer'

export class BlockNumberIndexer extends BaseIndexer {
  constructor(
    logger: Logger,
    private readonly clockIndexer: ClockIndexer,
    private readonly blockNumberRepository: BlockNumberRepository,
  ) {
    super(logger, [clockIndexer], {}, { batchSize: 1 })
    this.logger = this.logger.for(this)
  }

  override async start(): Promise<void> {
    await Promise.resolve()
    this.logger.info('BlockNumberIndexer started')
  }

  async update(): Promise<void> {
    await Promise.resolve()
    this.logger.info('BlockNumberIndexer update started')
  }
}
