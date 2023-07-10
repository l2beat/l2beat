import { CoingeckoClient, HttpClient, Logger } from '@l2beat/shared'

import { BlocksController } from '../../api/controllers/BlocksController'
import { DydxController } from '../../api/controllers/DydxController'
import { TvlController } from '../../api/controllers/tvl/TvlController'
import { createBlocksRouter } from '../../api/routers/BlocksRouter'
import { createDydxRouter } from '../../api/routers/DydxRouter'
import { createTvlRouter } from '../../api/routers/TvlRouter'
import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { ApplicationModule } from '../ApplicationModule'
import { createArbitrumTvlSubmodule } from './ArbitrumTvl'
import { createEthereumTvlSubmodule } from './EthereumTvl'

export function createTvlModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl.enabled) {
    logger.info('TVL module disabled')
    return
  }
  // #region database

  const db = {
    blockNumberRepository: new BlockNumberRepository(database, logger),
    priceRepository: new PriceRepository(database, logger),
    balanceRepository: new BalanceRepository(database, logger),
    reportRepository: new ReportRepository(database, logger),
    aggregatedReportRepository: new AggregatedReportRepository(
      database,
      logger,
    ),
    reportStatusRepository: new ReportStatusRepository(database, logger),
    balanceStatusRepository: new BalanceStatusRepository(database, logger),
  }
  // #endregion
  // #region peripherals

  const coingeckoClient = new CoingeckoClient(http, config.tvl.coingeckoApiKey)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  // #endregion
  // #region updaters

  const priceUpdater = new PriceUpdater(
    coingeckoQueryService,
    db.priceRepository,
    clock,
    config.tokens,
    logger,
  )

  // #endregion
  // #region api

  const blocksController = new BlocksController(db.blockNumberRepository)
  const tvlController = new TvlController(
    db.reportStatusRepository,
    db.aggregatedReportRepository,
    db.reportRepository,
    config.projects,
    config.tokens,
    logger,
  )

  const dydxController = new DydxController(db.aggregatedReportRepository)

  const blocksRouter = createBlocksRouter(blocksController)
  const tvlRouter = createTvlRouter(tvlController)
  const dydxRouter = createDydxRouter(dydxController)

  // #endregion

  const modules: (ApplicationModule | undefined)[] = [
    createEthereumTvlSubmodule(db, priceUpdater, config, logger, http, clock),
    createArbitrumTvlSubmodule(db, config, logger, http, clock),
  ]

  const start = async () => {
    logger = logger.for('TvlModule')
    logger.info('Starting')

    priceUpdater.start()

    logger.info('Starting modules...')

    for (const module of modules) {
      await module?.start?.()
    }

    logger.info('Started')
  }

  return {
    routers: [blocksRouter, tvlRouter, dydxRouter],
    start,
  }
}
