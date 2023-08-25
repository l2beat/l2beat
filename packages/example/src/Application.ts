import { Logger } from '@l2beat/backend-tools'

import { BaseIndexer, Retries } from '@l2beat/uif'
import { Config } from './Config'
import { BalanceIndexer } from './indexers/BalanceIndexer'
import { BlockNumberIndexer } from './indexers/BlockNumberIndexer'
import { FakeClockIndexer } from './indexers/FakeClockIndexer'
import { TvlIndexer } from './indexers/TvlIndexer'
import { BalanceRepository } from './repositories/BalanceRepository'
import { BlockNumberRepository } from './repositories/BlockNumberRepository'
import { TvlRepository } from './repositories/TvlRepository'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = new Logger({
      logLevel: 'DEBUG',
      format: 'pretty',
      colors: true,
      utc: true,
    })

    const blockNumberRepository = new BlockNumberRepository()
    const balanceRepository = new BalanceRepository()
    const tvlRepository = new TvlRepository()

    BaseIndexer.DEFAULT_RETRY_STRATEGY = Retries.exponentialBackOff({
      initialTimeoutMs: 100,
      maxAttempts: 10,
      maxTimeoutMs: 60 * 1000,
    })

    const fakeClockIndexer = new FakeClockIndexer(logger)
    const blockNumberIndexer = new BlockNumberIndexer(
      logger,
      fakeClockIndexer,
      blockNumberRepository,
    )
    const balanceIndexer = new BalanceIndexer(
      logger,
      blockNumberIndexer,
      balanceRepository,
    )
    const tvlIndexer = new TvlIndexer(logger, balanceIndexer, tvlRepository)

    this.start = async (): Promise<void> => {
      await Promise.resolve()
      console.log(`Application started: ${config.name}`)

      await fakeClockIndexer.start()
      await blockNumberIndexer.start()
      await balanceIndexer.start()
      await tvlIndexer.start()
    }
  }
}
