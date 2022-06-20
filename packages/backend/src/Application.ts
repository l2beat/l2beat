import { CoingeckoClient, HttpClient, Logger } from '@l2beat/common'
import { providers } from 'ethers'

import { ApiServer } from './api/ApiServer'
import { BlocksController } from './api/controllers/BlocksController'
import { ReportController } from './api/controllers/report/ReportController'
import { StatusController } from './api/controllers/StatusController'
import { createBlocksRouter } from './api/routers/BlocksRouter'
import { createReportRouter } from './api/routers/ReportRouter'
import { createStatusRouter } from './api/routers/StatusRouter'
import { Config } from './config'
import { BalanceUpdater } from './core/BalanceUpdater'
import { BlockNumberUpdater } from './core/BlockNumberUpdater'
import { PriceUpdater } from './core/PriceUpdater'
import { ReportUpdater } from './core/ReportUpdater'
import { SyncScheduler } from './core/SyncScheduler'
import { CoingeckoQueryService } from './peripherals/coingecko/CoingeckoQueryService'
import { BalanceRepository } from './peripherals/database/BalanceRepository'
import { BlockNumberRepository } from './peripherals/database/BlockNumberRepository'
import { CachedDataRepository } from './peripherals/database/CachedDataRepository'
import { Database } from './peripherals/database/Database'
import { PriceRepository } from './peripherals/database/PriceRepository'
import { ReportRepository } from './peripherals/database/ReportRepository'
import { EthereumClient } from './peripherals/ethereum/EthereumClient'
import { MulticallClient } from './peripherals/ethereum/MulticallClient'
import { EtherscanClient } from './peripherals/etherscan'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    /* - - - - - TOOLS - - - - - */

    const logger = new Logger(config.logger)

    /* - - - - - PERIPHERALS - - - - - */

    const database = new Database(config.databaseConnection, logger)
    const blockNumberRepository = new BlockNumberRepository(database, logger)
    const priceRepository = new PriceRepository(database, logger)
    const balanceRepository = new BalanceRepository(database, logger)
    const reportRepository = new ReportRepository(database, logger)
    const cachedDataRepository = new CachedDataRepository(database, logger)

    const http = new HttpClient()

    const provider = new providers.AlchemyProvider(
      'mainnet',
      config.alchemyApiKey,
    )

    const ethereumClient = new EthereumClient(provider)

    const multicall = new MulticallClient(ethereumClient)

    const coingeckoClient = new CoingeckoClient(http, config.coingeckoApiKey)

    const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

    const etherscanClient = new EtherscanClient(
      config.etherscanApiKey,
      http,
      logger,
    )

    /* - - - - - CORE - - - - - */

    const blockUpdater = new BlockNumberUpdater(
      etherscanClient,
      blockNumberRepository,
      logger,
    )

    const priceUpdater = new PriceUpdater(
      coingeckoQueryService,
      priceRepository,
      config.tokens,
      logger,
    )

    const balanceUpdater = new BalanceUpdater(
      multicall,
      balanceRepository,
      config.projects,
      logger,
    )

    const reportUpdater = new ReportUpdater(
      priceRepository,
      balanceRepository,
      reportRepository,
      config.tokens,
      logger,
    )

    const syncScheduler = new SyncScheduler(
      blockUpdater,
      priceUpdater,
      balanceUpdater,
      reportUpdater,
      config.core.minBlockTimestamp,
      logger,
    )

    /* - - - - - API - - - - - */

    const blocksController = new BlocksController(blockNumberRepository)

    const reportController = new ReportController(
      reportRepository,
      cachedDataRepository,
      priceRepository,
      config.projects,
      logger,
    )

    const statusController = new StatusController(
      priceRepository,
      balanceRepository,
      reportRepository,
      config.tokens,
      config.projects,
    )

    const apiServer = new ApiServer(config.port, logger, [
      createBlocksRouter(blocksController),
      createReportRouter(reportController),
      createStatusRouter(statusController),
    ])

    /* - - - - - START - - - - - */

    this.start = async () => {
      logger.for(this).info('Starting')

      await apiServer.listen()
      await database.migrateToLatest()

      reportController.start()
      syncScheduler.start()
    }
  }
}
