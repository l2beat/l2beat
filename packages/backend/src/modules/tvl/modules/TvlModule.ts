import { Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import { notUndefined } from '@l2beat/shared-pure'

import { Config } from '../../../config'
import { ChainTvlConfig } from '../../../config/Config'
import { TvlCleanerRepository } from '../../../peripherals/database/TvlCleanerRepository'
import { Peripherals } from '../../../peripherals/Peripherals'
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
import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ReportRepository } from '../repositories/ReportRepository'
import { TotalSupplyRepository } from '../repositories/TotalSupplyRepository'
import { chainTvlModule } from './ChainTvlModule'
import { createEthereumTvlModule } from './EthereumTvlModule'
import { TvlCleaner } from './TvlCleaner'

export function createTvlModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl.enabled) {
    logger.info('TVL module disabled')
    return
  }
  // #region peripherals

  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.tvl.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  // #endregion
  // #region updaters

  const priceUpdater = new PriceUpdater(
    coingeckoQueryService,
    peripherals.getRepository(PriceRepository),
    clock,
    config.tokens,
    logger,
  )

  const tvlCleaner = new TvlCleaner(
    clock,
    logger,
    peripherals.getRepository(TvlCleanerRepository),
    [
      peripherals.getRepository(BlockNumberRepository),
      peripherals.getRepository(BalanceRepository),
      peripherals.getRepository(TotalSupplyRepository),
      peripherals.getRepository(ReportRepository),
      peripherals.getRepository(AggregatedReportRepository),
    ],
  )

  // #endregion
  // #region modules

  const createChainTvlModule = (tvlConfig: ChainTvlConfig) =>
    tvlConfig.chain === 'ethereum'
      ? createEthereumTvlModule(
          peripherals,
          priceUpdater,
          config,
          logger,
          clock,
        )
      : chainTvlModule(
          tvlConfig,
          config.tokens,
          peripherals,
          priceUpdater,
          coingeckoQueryService,
          clock,
          logger,
        )

  const modules = config.tvl.modules
    .map(createChainTvlModule)
    .filter(notUndefined)

  // #endregion

  const aggregatedReportUpdater = new AggregatedReportUpdater(
    modules.flatMap((x) => x.reportUpdaters ?? []),
    peripherals.getRepository(AggregatedReportRepository),
    peripherals.getRepository(AggregatedReportStatusRepository),
    clock,
    config.projects,
    logger,
  )

  // #region api
  const tvlController = new TvlController(
    peripherals.getRepository(AggregatedReportRepository),
    peripherals.getRepository(ReportRepository),
    peripherals.getRepository(AggregatedReportStatusRepository),
    peripherals.getRepository(BalanceRepository),
    peripherals.getRepository(PriceRepository),
    config.projects,
    config.tokens,
    logger,
    aggregatedReportUpdater.getConfigHash(),
    { errorOnUnsyncedTvl: config.tvl.errorOnUnsyncedTvl },
  )

  const dydxController = new DydxController(
    peripherals.getRepository(AggregatedReportRepository),
  )

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
