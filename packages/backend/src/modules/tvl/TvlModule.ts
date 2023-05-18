import { CoingeckoClient, HttpClient, Logger } from '@l2beat/shared'
import { providers } from 'ethers'

import { BlocksController } from '../../api/controllers/BlocksController'
import { DydxController } from '../../api/controllers/DydxController'
import { TvlController } from '../../api/controllers/tvl/TvlController'
import { createBlocksRouter } from '../../api/routers/BlocksRouter'
import { createDydxRouter } from '../../api/routers/DydxRouter'
import { createTvlRouter } from '../../api/routers/TvlRouter'
import { Config } from '../../config'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { ReportUpdater } from '../../core/reports/ReportUpdater'
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
): ApplicationModule | undefined {
  if (!config.tvl) {
    logger.info('TVL module disabled')
    return
  }

  // #region database
  const blockNumberRepository = new BlockNumberRepository(database, logger)
  const priceRepository = new PriceRepository(database, logger)
  const balanceRepository = new BalanceRepository(database, logger)
  const reportRepository = new ReportRepository(database, logger)
  const aggregateReportRepository = new AggregateReportRepository(
    database,
    logger,
  )
  const reportStatusRepository = new ReportStatusRepository(database, logger)
  const balanceStatusRepository = new BalanceStatusRepository(database, logger)

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

  const dydxController = new DydxController(aggregateReportRepository)

  const blocksRouter = createBlocksRouter(blocksController)
  const tvlRouter = createTvlRouter(tvlController)
  const dydxRouter = createDydxRouter(dydxController)

  // #endregion

  const start = async () => {
    if (!config.syncEnabled) {
      logger.info('TVL sync disabled')
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
    routers: [blocksRouter, tvlRouter, dydxRouter],
    start,
  }
}
