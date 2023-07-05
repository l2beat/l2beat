import {
  CoingeckoClient,
  EtherscanClient,
  HttpClient,
  Logger,
} from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { BlocksController } from '../../api/controllers/BlocksController'
import { DydxController } from '../../api/controllers/DydxController'
import { TvlController } from '../../api/controllers/tvl/TvlController'
import { createBlocksRouter } from '../../api/routers/BlocksRouter'
import { createDydxRouter } from '../../api/routers/DydxRouter'
import { createTvlRouter } from '../../api/routers/TvlRouter'
import { Config } from '../../config'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { EthereumBalanceProvider } from '../../core/balances/providers/EthereumBalanceProvider'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { ReportUpdater } from '../../core/reports/ReportUpdater'
import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
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
  const aggregatedReportRepository = new AggregatedReportRepository(
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
    http,
    config.tvl.etherscanApiKey,
    logger,
  )
  const ethereumBalanceProvider = new EthereumBalanceProvider(multicall)

  // #endregion
  // #region updaters

  const blockNumberUpdater = new BlockNumberUpdater(
    etherscanClient,
    blockNumberRepository,
    clock,
    logger,
    ChainId.ETHEREUM,
  )
  const priceUpdater = new PriceUpdater(
    coingeckoQueryService,
    priceRepository,
    clock,
    config.tokens,
    logger,
  )
  const balanceUpdater = new BalanceUpdater(
    ethereumBalanceProvider,
    blockNumberUpdater,
    balanceRepository,
    balanceStatusRepository,
    clock,
    config.projects,
    logger,
    ChainId.ETHEREUM,
  )
  const reportUpdater = new ReportUpdater(
    priceUpdater,
    balanceUpdater,
    reportRepository,
    aggregatedReportRepository,
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
    aggregatedReportRepository,
    reportRepository,
    config.projects,
    config.tokens,
    logger,
  )

  const dydxController = new DydxController(aggregatedReportRepository)

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
