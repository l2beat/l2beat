import { CoingeckoClient, HttpClient, Logger } from '@l2beat/common'
import { providers } from 'ethers'
import { compact } from 'lodash'

import { ApiServer } from './api/ApiServer'
import { BlocksController } from './api/controllers/BlocksController'
import { DydxController } from './api/controllers/DydxController'
import { HealthController } from './api/controllers/HealthController'
import { StatusController } from './api/controllers/status/StatusController'
import { TvlController } from './api/controllers/tvl/TvlController'
import { createBlocksRouter } from './api/routers/BlocksRouter'
import { createDydxRouter } from './api/routers/DydxRouter'
import { createHealthRouter } from './api/routers/HealthRouter'
import { createStatusRouter } from './api/routers/StatusRouter'
import { createTvlRouter } from './api/routers/TvlRouter'
import { Config } from './config'
import { BalanceUpdater } from './core/balances/BalanceUpdater'
import { BlockNumberUpdater } from './core/BlockNumberUpdater'
import { Clock } from './core/Clock'
import { PriceUpdater } from './core/PriceUpdater'
import { ReportUpdater } from './core/reports/ReportUpdater'
import { CoingeckoQueryService } from './peripherals/coingecko/CoingeckoQueryService'
import { AggregateReportRepository } from './peripherals/database/AggregateReportRepository'
import { BalanceRepository } from './peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from './peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from './peripherals/database/BlockNumberRepository'
import { PriceRepository } from './peripherals/database/PriceRepository'
import { ReportRepository } from './peripherals/database/ReportRepository'
import { ReportStatusRepository } from './peripherals/database/ReportStatusRepository'
import { Database } from './peripherals/database/shared/Database'
import { EthereumClient } from './peripherals/ethereum/EthereumClient'
import { MulticallClient } from './peripherals/ethereum/MulticallClient'
import { EtherscanClient } from './peripherals/etherscan'
import { getActivityModule } from './setup/ActivityModule'
import { handleServerError, reportError } from './tools/ErrorReporter'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    // #region tools

    const logger = new Logger({ ...config.logger, reportError })

    // #endregion
    // #region peripherals

    const database = new Database(config.databaseConnection, logger)
    const blockNumberRepository = new BlockNumberRepository(database, logger)
    const priceRepository = new PriceRepository(database, logger)
    const balanceRepository = new BalanceRepository(database, logger)
    const reportRepository = new ReportRepository(database, logger)
    const aggregateReportRepository = new AggregateReportRepository(
      database,
      logger,
    )
    const reportStatusRepository = new ReportStatusRepository(database, logger)
    const balanceStatusRepository = new BalanceStatusRepository(
      database,
      logger,
    )
    const http = new HttpClient()

    const ethereumProvider = new providers.AlchemyProvider(
      'mainnet',
      config.alchemyApiKey,
    )

    const ethereumClient = new EthereumClient(ethereumProvider, logger)

    const multicall = new MulticallClient(ethereumClient)

    const coingeckoClient = new CoingeckoClient(http, config.coingeckoApiKey)

    const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

    const etherscanClient = new EtherscanClient(
      config.etherscanApiKey,
      http,
      logger,
    )

    // #endregion
    // #region core

    const clock = new Clock(
      config.core.minBlockTimestamp,
      config.core.safeTimeOffsetSeconds,
    )

    const blockNumberUpdater = new BlockNumberUpdater(
      etherscanClient,
      blockNumberRepository,
      clock,
      logger,
    )

    const priceUpdater = new PriceUpdater(
      coingeckoQueryService,
      priceRepository,
      clock,
      config.tokens,
      logger,
    )

    const balanceUpdater = new BalanceUpdater(
      multicall,
      blockNumberUpdater,
      balanceRepository,
      balanceStatusRepository,
      clock,
      config.projects,
      logger,
    )

    const reportUpdater = new ReportUpdater(
      priceUpdater,
      balanceUpdater,
      reportRepository,
      aggregateReportRepository,
      reportStatusRepository,
      clock,
      config.projects,
      logger,
    )
    // #endregion
    // #region api

    const blocksController = new BlocksController(blockNumberRepository)

    const tvlController = new TvlController(
      reportStatusRepository,
      aggregateReportRepository,
      reportRepository,
      config.projects,
      config.tokens,
      logger,
    )

    const statusController = new StatusController(
      priceRepository,
      balanceStatusRepository,
      reportStatusRepository,
      clock,
      config.tokens,
      config.projects,
    )

    const dydxController = new DydxController(aggregateReportRepository)
    const healthController = new HealthController(config.health)

    const activityModule = getActivityModule(
      config,
      logger,
      http,
      database,
      clock,
    )

    const apiServer = new ApiServer(
      config.port,
      logger,
      compact([
        createBlocksRouter(blocksController),
        createTvlRouter(tvlController),
        createStatusRouter(statusController),
        createDydxRouter(dydxController),
        activityModule?.router,
        createHealthRouter(healthController),
      ]),
      handleServerError,
    )

    // #endregion
    // #region start

    this.start = async () => {
      logger.for(this).info('Starting')

      await apiServer.listen()
      if (config.freshStart) await database.rollbackAll()
      await database.migrateToLatest()

      if (config.syncEnabled) {
        if (config.tvlReportSync) {
          priceUpdater.start()
          await blockNumberUpdater.start()
          await balanceUpdater.start()
          await reportUpdater.start()
        }

        activityModule?.start()
      }
    }

    // #endregion
  }
}
