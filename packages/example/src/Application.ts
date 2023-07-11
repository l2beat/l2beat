import { Logger, LogLevel } from '@l2beat/uif'

import { Config } from './Config'
import { BalanceIndexer } from './indexers/BalanceIndexer'
import { BlockNumberIndexer } from './indexers/BlockNumberIndexer'
import { ClockIndexer } from './indexers/ClockIndexer'
import { BalanceRepository } from './repositories/BalanceRepository'
import { BlockNumberRepository } from './repositories/BlockNumberRepository'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = new Logger({
      logLevel: LogLevel.DEBUG,
      format: 'pretty',
    })

    const blockNumberRepository = new BlockNumberRepository()
    const balanceRepository = new BalanceRepository()

    const clockIndexer = new ClockIndexer(logger)
    const blockNumberIndexer = new BlockNumberIndexer(
      logger,
      clockIndexer,
      blockNumberRepository,
    )
    const balanceIndexer = new BalanceIndexer(
      logger,
      blockNumberIndexer,
      balanceRepository,
    )

    this.start = async (): Promise<void> => {
      await Promise.resolve()
      console.log(`Application started: ${config.name}`)

      await clockIndexer.start()
      await blockNumberIndexer.start()
      await balanceIndexer.start()
    }
  }
}
