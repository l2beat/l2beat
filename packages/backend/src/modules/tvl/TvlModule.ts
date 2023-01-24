import { CoingeckoClient, HttpClient, Logger } from '@l2beat/common'
import { providers } from 'ethers'

import { BlocksController } from '../../api/controllers/BlocksController'
import { DydxController } from '../../api/controllers/DydxController'
import { StatusController } from '../../api/controllers/status/StatusController'
import { TvlController } from '../../api/controllers/tvl/TvlController'
import { createBlocksRouter } from '../../api/routers/BlocksRouter'
import { createDydxRouter } from '../../api/routers/DydxRouter'
import { createStatusRouter } from '../../api/routers/StatusRouter'
import { createTvlRouter } from '../../api/routers/TvlRouter'
import { Config } from '../../config'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { ReportUpdater } from '../../core/reports/ReportUpdater'
import { Metrics } from '../../Metrics'
import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import { AggregateReportRepository } from '../../peripherals/database/AggregateReportRepository'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
import { EtherscanClient } from '../../peripherals/etherscan'
import { ApplicationModule } from '../ApplicationModule'

export function createTvlModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
  metrics: Metrics,
): ApplicationModule | undefined {
  if (!config.tvl) {
    return
  }

  // #region database

  const blockNumberRepository = new BlockNumberRepository(
    database,
    logger,
    metrics,
  )
  const priceRepository = new PriceRepository(database, logger, metrics)
  const balanceRepository = new BalanceRepository(database, logger, metrics)
  const reportRepository = new ReportRepository(database, logger, metrics)
  const aggregateReportRepository = new AggregateReportRepository(
    database,
    logger,
    metrics,
  )
  const reportStatusRepository = new ReportStatusRepository(
    database,
    logger,
    metrics,
  )
  const balanceStatusRepository = new BalanceStatusRepository(
    database,
    logger,
    metrics,
  )

  // #endregion
  // #region peripherals

  const ethereumProvider = new providers.AlchemyProvider(
    'mainnet',
    config.tvl.alchemyApiKey,
  )
  const ethereumClient = new EthereumClient(ethereumProvider, logger)
  const multicall = new MulticallClient(ethereumClient)
  const coingeckoClient = new CoingeckoClient(http, config.tvl.coingeckoApiKey)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
  const etherscanClient = new EtherscanClient(
    config.tvl.etherscanApiKey,
    http,
    logger,
  )

  // #endregion
  // #region updaters

  const blockNumberUpdater = new BlockNumberUpdater(
    etherscanClient,
    blockNumberRepository,
    clock,
    logger,
    metrics,
  )
  const priceUpdater = new PriceUpdater(
    coingeckoQueryService,
    priceRepository,
    clock,
    config.tvl.tokens,
    logger,
    metrics,
  )
  const balanceUpdater = new BalanceUpdater(
    multicall,
    blockNumberUpdater,
    balanceRepository,
    balanceStatusRepository,
    clock,
    config.projects,
    logger,
    metrics,
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
    metrics,
  )

  // #endregion
  // #region api

  const blocksController = new BlocksController(blockNumberRepository)
  const tvlController = new TvlController(
    reportStatusRepository,
    aggregateReportRepository,
    reportRepository,
    config.projects,
    config.tvl.tokens,
    logger,
  )
  const statusController = new StatusController(
    priceRepository,
    balanceStatusRepository,
    reportStatusRepository,
    clock,
    config.tvl.tokens,
    config.projects,
  )
  const dydxController = new DydxController(aggregateReportRepository)

  const blocksRouter = createBlocksRouter(blocksController)
  const tvlRouter = createTvlRouter(tvlController)
  const statusRouter = createStatusRouter(statusController)
  const dydxRouter = createDydxRouter(dydxController)

  // #endregion

  const start = async () => {
    if (!config.syncEnabled) {
      return
    }

    logger = logger.for('TvlModule')
    logger.info('Starting')

    priceUpdater.start()
    await blockNumberUpdater.start()
    await balanceUpdater.start()
    await reportUpdater.start()

    logger.info('Started')
  }

  return {
    routers: [blocksRouter, tvlRouter, statusRouter, dydxRouter],
    start,
  }
}
