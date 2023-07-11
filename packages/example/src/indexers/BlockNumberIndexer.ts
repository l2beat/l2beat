import { BaseIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { ClockIndexer } from './ClockIndexer'

export class BlockNumberIndexer extends BaseIndexer {
  constructor(
    logger: Logger,
    private readonly clockIndexer: ClockIndexer,
    private readonly blockNumberRepository: BlockNumberRepository,
  ) {
    super(logger, [clockIndexer])
  }

  override async start(): Promise<void> {
    await Promise.resolve()
    this.logger.info('Started')
  }

  override async update(from: number, to: number): Promise<number> {
    this.logger.info('Update started')
    await Promise.resolve()
    return to
  }

  override async invalidate(): Promise<void> {
    this.logger.info('Invalidate started')
    return Promise.resolve()
  }

  override async setHeight(height: number): Promise<void> {
    await Promise.resolve()
    this.logger.info('setHeight started')
  }
}
