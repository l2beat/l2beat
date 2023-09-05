import { Logger } from '@l2beat/backend-tools'
import { BaseIndexer, Retries } from '@l2beat/uif'

import { Config } from './Config'
import { AB_BC_Indexer } from './indexers/AB_BC_Indexer'
import { ABC_Indexer } from './indexers/ABC_Indexer'
import { BalanceIndexer } from './indexers/BalanceIndexer'
import { BlockNumberIndexer } from './indexers/BlockNumberIndexer'
import { FakeClockIndexer } from './indexers/FakeClockIndexer'
import { TvlIndexer } from './indexers/TvlIndexer'
import { AB_BC_Repository } from './repositories/AB_BC_Repository'
import { ABC_Repository } from './repositories/ABC_Repository'
import { BalanceRepository } from './repositories/BalanceRepository'
import { BlockNumberRepository } from './repositories/BlockNumberRepository'
import { TvlRepository } from './repositories/TvlRepository'

interface Module {
  start: () => Promise<void>
}

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = new Logger({
      logLevel: 'DEBUG',
      format: 'pretty',
      colors: true,
      utc: true,
    })

    const modules = [
      createMainModule(config, logger),
      createABCModule(config, logger),
    ]

    this.start = async (): Promise<void> => {
      console.log(`Application started: ${config.name}`)
      await Promise.all(modules.map((module) => module?.start()))
    }
  }
}

function createABCModule(config: Config, logger: Logger): Module | undefined {
  if (!config.modules.abc) {
    return undefined
  }

  const blockNumberRepository = new BlockNumberRepository()
  const abc_repository = new ABC_Repository()
  const ab_bc_repository = new AB_BC_Repository()

  const fakeClockIndexer = new FakeClockIndexer(
    logger.configure({ logLevel: 'NONE' }),
  )
  const blockNumberIndexer = new BlockNumberIndexer(
    logger.configure({ logLevel: 'NONE' }),
    fakeClockIndexer,
    blockNumberRepository,
  )
  const abc_Indexer = new ABC_Indexer(
    logger,
    blockNumberIndexer,
    abc_repository,
  )
  const ab_bc_indexer = new AB_BC_Indexer(
    logger,
    abc_Indexer,
    ab_bc_repository,
    abc_repository,
  )

  return {
    start: async (): Promise<void> => {
      console.log(`Module started: ABCModule`)

      await fakeClockIndexer.start()
      await blockNumberIndexer.start()
      await abc_Indexer.start()
      await ab_bc_indexer.start()
    },
  }
}

function createMainModule(config: Config, logger: Logger): Module | undefined {
  if (!config.modules.main) {
    return undefined
  }

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

  return {
    start: async (): Promise<void> => {
      await Promise.resolve()
      console.log(`Application started: MainModule`)

      await fakeClockIndexer.start()
      await blockNumberIndexer.start()
      await balanceIndexer.start()
      await tvlIndexer.start()
    },
  }
}
