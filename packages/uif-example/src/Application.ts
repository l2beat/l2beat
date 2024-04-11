import { Logger } from '@l2beat/backend-tools'

import { BlockIndexer } from './blocks/BlockIndexer'
import { BlockIndexerRepository } from './blocks/BlockIndexerRepository'
import { BlockRepository } from './blocks/BlockRepository'
import { BlockService } from './blocks/BlockService'
import { HourlyIndexer } from './HourlyIndexer'
import { msToHours, ONE_HOUR_MS } from './utils'

export class Application {
  start: () => Promise<void>

  constructor() {
    const logger = Logger.DEBUG

    const hourlyIndexer = new HourlyIndexer(logger)

    const blockService = new BlockService()
    const blockRepository = new BlockRepository()
    const blockIndexerRepository = new BlockIndexerRepository()
    const blockIndexer = new BlockIndexer(
      blockService,
      blockRepository,
      blockIndexerRepository,
      msToHours(Date.now() - 72 * ONE_HOUR_MS),
      hourlyIndexer,
      logger,
    )

    this.start = async (): Promise<void> => {
      logger.for('Application').info('Starting')

      await hourlyIndexer.start()
      await blockIndexer.start()

      logger.for('Application').info('Started')
    }
  }
}
