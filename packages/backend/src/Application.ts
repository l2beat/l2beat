import { CoingeckoClient, HttpClient, Logger } from '@l2beat/common'
import { providers } from 'ethers'

import { ApiServer } from './api/ApiServer'
import { ActivityController } from './api/controllers/ActivityController'
import { BlocksController } from './api/controllers/BlocksController'
import { DydxController } from './api/controllers/DydxController'
import { EventController } from './api/controllers/events/EventsController'
import { ReportController } from './api/controllers/report/ReportController'
import { StatusController } from './api/controllers/status/StatusController'
import { createActivityRouter } from './api/routers/ActivityRouter'
import { createBlocksRouter } from './api/routers/BlocksRouter'
import { createDydxRouter } from './api/routers/DydxRouter'
import { createEventsRouter } from './api/routers/EventsRouter'
import { createReportRouter } from './api/routers/ReportRouter'
import { createStatusRouter } from './api/routers/StatusRouter'
import { Config } from './config'
import { BalanceUpdater } from './core/balances/BalanceUpdater'
import { BlockNumberUpdater } from './core/BlockNumberUpdater'
import { Clock } from './core/Clock'
import { EventUpdater } from './core/events/EventUpdater'
import { PriceUpdater } from './core/PriceUpdater'
import { ReportUpdater } from './core/reports/ReportUpdater'
import { ZksyncTransactionUpdater } from './core/transaction-count/ZksyncTransactionUpdater'
import { CoingeckoQueryService } from './peripherals/coingecko/CoingeckoQueryService'
import { AggregateReportRepository } from './peripherals/database/AggregateReportRepository'
import { BalanceRepository } from './peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from './peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from './peripherals/database/BlockNumberRepository'
import { EventRepository } from './peripherals/database/EventRepository'
import { PriceRepository } from './peripherals/database/PriceRepository'
import { ReportRepository } from './peripherals/database/ReportRepository'
import { ReportStatusRepository } from './peripherals/database/ReportStatusRepository'
import { RpcTransactionCountRepository } from './peripherals/database/RpcTransactionCountRepository'
import { Database } from './peripherals/database/shared/Database'
import { StarkexTransactionCountRepository } from './peripherals/database/StarkexTransactionCountRepository'
import { ZksyncTransactionRepository } from './peripherals/database/ZksyncTransactionRepository'
import { EthereumClient } from './peripherals/ethereum/EthereumClient'
import { MulticallClient } from './peripherals/ethereum/MulticallClient'
import { EtherscanClient } from './peripherals/etherscan'
import { StarkexClient } from './peripherals/starkex'
import { ZksyncClient } from './peripherals/zksync'
import { createRpcTransactionUpdaters } from './setup/createRpcTransactionUpdaters'
import { createStarkexTransactionUpdaters } from './setup/createStarkexTransactionUpdaters'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    // #region tools

    const logger = new Logger(config.logger)

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
    const eventRepository = new EventRepository(database, logger)
    const rpcTransactionCountRepository = new RpcTransactionCountRepository(
      database,
      logger,
    )
    const starkexTransactionCountRepository =
      new StarkexTransactionCountRepository(database, logger)
    const zksyncTransactionRepository = new ZksyncTransactionRepository(
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

    const starkexClient = new StarkexClient(
      config.starkexApiUrl,
      config.starkexApiKey,
      http,
      logger,
    )

    const zksyncClient = new ZksyncClient(http, logger)

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

    const eventUpdater = new EventUpdater(
      ethereumClient,
      blockNumberUpdater,
      eventRepository,
      clock,
      config.projects,
      logger,
    )

    const rpcTransactionUpdaters = createRpcTransactionUpdaters(
      config,
      rpcTransactionCountRepository,
      clock,
      logger,
    )

    const starkexTransactionUpdaters = createStarkexTransactionUpdaters(
      config,
      starkexTransactionCountRepository,
      starkexClient,
      clock,
      logger,
    )

    const zksyncTransactionUpdater = new ZksyncTransactionUpdater(
      zksyncClient,
      zksyncTransactionRepository,
      clock,
      logger,
    )

    // #endregion
    // #region api

    const blocksController = new BlocksController(blockNumberRepository)

    const reportController = new ReportController(
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

    const eventController = new EventController(
      eventRepository,
      clock,
      config.projects,
    )

    const dydxController = new DydxController(aggregateReportRepository)

    const activityController = new ActivityController([
      ...rpcTransactionUpdaters,
      ...starkexTransactionUpdaters,
      zksyncTransactionUpdater,
    ])

    const apiServer = new ApiServer(config.port, logger, [
      createBlocksRouter(blocksController),
      createReportRouter(reportController),
      createStatusRouter(statusController),
      createDydxRouter(dydxController),
      createEventsRouter(eventController),
      createActivityRouter(activityController),
    ])

    // #endregion
    // #region start

    this.start = async () => {
      logger.for(this).info('Starting')

      await apiServer.listen()
      if (config.freshStart) await database.rollbackAll()
      await database.migrateToLatest()

      if (config.syncEnabled) {
        priceUpdater.start()
        await blockNumberUpdater.start()
        await balanceUpdater.start()
        await reportUpdater.start()

        if (config.transactionCountSyncEnabled) {
          for (const updater of rpcTransactionUpdaters) {
            updater.start()
          }
          for (const updater of starkexTransactionUpdaters) {
            updater.start()
          }
          zksyncTransactionUpdater.start()
        }

        if (config.eventsSyncEnabled) {
          eventUpdater.start()
        }
      }
    }

    // #endregion
  }
}
