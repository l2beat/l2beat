import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { notUndefined } from '@l2beat/shared-pure'

import { Config } from '../../../config'
import { ChainTvlConfig } from '../../../config/Config'
import { Database } from '../../../peripherals/database/Database'
import { Clock } from '../../../tools/Clock'
import { ApplicationModule } from '../../ApplicationModule'
import { DydxController } from '../api/DydxController'
import { createDydxRouter } from '../api/DydxRouter'
import { TvlController } from '../api/TvlController'
import { createTvlRouter } from '../api/TvlRouter'
import { createTvlStatusRouter } from '../api/TvlStatusRouter'
import { PriceUpdater } from '../PriceUpdater'
import { AggregatedReportUpdater } from '../reports/AggregatedReportUpdater'
import { AggregatedReportRepository } from '../repositories/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../repositories/AggregatedReportStatusRepository'
import { BalanceRepository } from '../repositories/BalanceRepository'
import { BalanceStatusRepository } from '../repositories/BalanceStatusRepository'
import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { CirculatingSupplyRepository } from '../repositories/CirculatingSupplyRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ReportRepository } from '../repositories/ReportRepository'
import { ReportStatusRepository } from '../repositories/ReportStatusRepository'
import { TotalSupplyRepository } from '../repositories/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../repositories/TotalSupplyStatusRepository'
import { chainTvlModule } from './ChainTvlModule'
import { createEthereumTvlModule } from './EthereumTvlModule'
import { TvlCleaner } from './TvlCleaner'
import { TvlDatabase } from './types'

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

  const db: TvlDatabase = {
    blockNumberRepository: new BlockNumberRepository(database, logger),
    priceRepository: new PriceRepository(database, logger),
    balanceRepository: new BalanceRepository(database, logger),
    totalSupplyRepository: new TotalSupplyRepository(database, logger),
    circulatingSupplyRepository: new CirculatingSupplyRepository(
      database,
      logger,
    ),
    reportRepository: new ReportRepository(database, logger),
    aggregatedReportRepository: new AggregatedReportRepository(
      database,
      logger,
    ),
    // status tables
    balanceStatusRepository: new BalanceStatusRepository(database, logger),
    totalSupplyStatusRepository: new TotalSupplyStatusRepository(
      database,
      logger,
    ),
    reportStatusRepository: new ReportStatusRepository(database, logger),
    aggregatedReportStatusRepository: new AggregatedReportStatusRepository(
      database,
      logger,
    ),
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

  const repositoriesToClean = [
    db.blockNumberRepository,
    db.balanceRepository,
    db.totalSupplyRepository,
    db.reportRepository,
    db.aggregatedReportRepository,
  ]
  const tvlCleaner = new TvlCleaner(clock, logger, repositoriesToClean)

  // #endregion
  // #region modules

  const createChainTvlModule = (tvlConfig: ChainTvlConfig) =>
    tvlConfig.chain === 'ethereum'
      ? createEthereumTvlModule(db, priceUpdater, config, logger, http, clock)
      : chainTvlModule(
          tvlConfig,
          config.tokens,
          db,
          priceUpdater,
          coingeckoQueryService,
          http,
          clock,
          logger,
        )

  const modules = config.tvl.modules
    .map(createChainTvlModule)
    .filter(notUndefined)

  // #endregion

  const aggregatedReportUpdater = new AggregatedReportUpdater(
    modules.flatMap((x) => x.reportUpdaters ?? []),
    db.aggregatedReportRepository,
    db.aggregatedReportStatusRepository,
    clock,
    config.projects,
    logger,
  )

  // #region api
  const tvlController = new TvlController(
    db.aggregatedReportRepository,
    db.reportRepository,
    db.aggregatedReportStatusRepository,
    db.balanceRepository,
    db.priceRepository,
    config.projects,
    config.tokens,
    logger,
    aggregatedReportUpdater.getConfigHash(),
    { errorOnUnsyncedTvl: config.tvl.errorOnUnsyncedTvl },
  )

  const dydxController = new DydxController(db.aggregatedReportRepository)

  const tvlRouter = createTvlRouter(tvlController, config.api)
  const dydxRouter = createDydxRouter(dydxController)
  const tvlStatusRouter = createTvlStatusRouter(
    clock,
    priceUpdater,
    aggregatedReportUpdater,
    modules,
  )

  // #endregion

  const start = async () => {
    logger = logger.for('TvlModule')
    logger.info('Starting')

    priceUpdater.start()

    if (config.api.cache.tvl) {
      tvlController.start()
    }
    if (config.tvlCleanerEnabled) {
      tvlCleaner.start()
    }

    logger.info('Starting modules...')

    for (const module of modules) {
      await module.start?.()
    }

    await aggregatedReportUpdater.start()

    logger.info('Started')
  }

  return {
    routers: [tvlRouter, dydxRouter, tvlStatusRouter],
    start,
  }
}
