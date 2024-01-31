import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { notUndefined } from '@l2beat/shared-pure'

import { BlocksController } from '../../api/controllers/BlocksController'
import { DydxController } from '../../api/controllers/DydxController'
import { TvlController } from '../../api/controllers/tvl/TvlController'
import { createBlocksRouter } from '../../api/routers/BlocksRouter'
import { createDydxRouter } from '../../api/routers/DydxRouter'
import { createTvlRouter } from '../../api/routers/TvlRouter'
import { createTvlStatusRouter } from '../../api/routers/TvlStatusRouter'
import { Config } from '../../config'
import { ChainTvlConfig } from '../../config/Config'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { AggregatedReportUpdater } from '../../core/reports/AggregatedReportUpdater'
import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../peripherals/database/AggregatedReportStatusRepository'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'
import { CirculatingSupplyRepository } from '../../peripherals/database/CirculatingSupplyRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { TotalSupplyRepository } from '../../peripherals/database/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { ApplicationModule } from '../ApplicationModule'
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
    reportRepository: new ReportRepository(database, logger),
    aggregatedReportRepository: new AggregatedReportRepository(
      database,
      logger,
    ),
    reportStatusRepository: new ReportStatusRepository(database, logger),
    aggregatedReportStatusRepository: new AggregatedReportStatusRepository(
      database,
      logger,
    ),
    balanceStatusRepository: new BalanceStatusRepository(database, logger),
    totalSupplyRepository: new TotalSupplyRepository(database, logger),
    totalSupplyStatusRepository: new TotalSupplyStatusRepository(
      database,
      logger,
    ),
    circulatingSupplyRepository: new CirculatingSupplyRepository(
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
  const tvlCleaner = new TvlCleaner(clock, logger, [db.reportRepository])

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
  const blocksController = new BlocksController(db.blockNumberRepository)

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

  const blocksRouter = createBlocksRouter(blocksController)
  const tvlRouter = createTvlRouter(tvlController)
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
    tvlCleaner.start()

    logger.info('Starting modules...')

    for (const module of modules) {
      await module.start?.()
    }

    await aggregatedReportUpdater.start()

    logger.info('Started')
  }

  return {
    routers: [blocksRouter, tvlRouter, dydxRouter, tvlStatusRouter],
    start,
  }
}
