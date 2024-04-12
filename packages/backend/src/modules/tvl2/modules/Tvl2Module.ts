import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Config } from '../../../config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../../ApplicationModule'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { Tvl2Controller } from '../api/Tvl2Controller'
import { createTvl2Router } from '../api/Tvl2Router'
import { createTvl2StatusRouter } from '../api/Tvl2StatusRouter'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createChainModules } from './ChainModule'
import { createCirculatingSupplyModule } from './CirculatingSupplyModule'
import { createPriceModule } from './PriceModule'

export function createTvl2Module(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl2) {
    logger.info('Tvl2Module disabled')
    return
  }

  const indexerStateRepository = peripherals.getRepository(
    IndexerStateRepository,
  )
  const configurationsRepository = peripherals.getRepository(
    IndexerConfigurationRepository,
  )
  const indexerService = new IndexerService(
    indexerStateRepository,
    configurationsRepository,
  )

  const syncOptimizer = new SyncOptimizer(clock, {
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceModule = createPriceModule(
    config.tvl2,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
  )

  const modules = [
    priceModule,
    ...createChainModules(
      config.tvl2,
      peripherals,
      logger,
      hourlyIndexer,
      syncOptimizer,
      indexerService,
    ),
    createCirculatingSupplyModule(
      config.tvl2,
      logger,
      peripherals,
      hourlyIndexer,
      syncOptimizer,
      indexerService,
    ),
  ]

  const tvlController = new Tvl2Controller(
    peripherals.getRepository(AmountRepository),
    peripherals.getRepository(PriceRepository),
    {
      get safeHeight() {
        return Math.min(...priceModule.indexers.map((i) => i.safeHeight))
      },
    },
    // this is tricky. We need to answer the question: what is the min and max timestamp.
    // minTimestamp:
    config.projects.map((p) => ({
      id: p.projectId,
      // TODO: we should have a minTimestamp for each project calculated. It should be a part of the project config.
      minTimestamp: p.escrows
        .map((e) => e.sinceTimestamp)
        .reduce((a, b) => UnixTime.min(a, b)),
      // TODO: we should know the associated indexers for each project.
      // i.e. Optimism is not interested in ChainAmountIndexer:arbitrum (or is it?)
      indexers: modules.map((m) => m.indexers).flat(),
    })),
    config.tvl2,
  )
  const statusRouter = createTvl2StatusRouter(
    config.tvl2,
    modules.map((m) => m.indexers).flat(),
    clock,
  )
  const tvlRouter = createTvl2Router(tvlController)

  const start = async () => {
    await hourlyIndexer.start()

    for (const module of modules) {
      await module.start()
    }
  }

  return {
    routers: [statusRouter, tvlRouter],
    start,
  }
}
