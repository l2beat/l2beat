import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../../ApplicationModule'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { createTvl2StatusRouter } from '../api/Tvl2StatusRouter'
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

  const modules = [
    // createPriceModule(
    //   config.tvl2,
    //   logger,
    //   peripherals,
    //   hourlyIndexer,
    //   syncOptimizer,
    // ),
    // ...createChainModules(
    //   config.tvl2,
    //   peripherals,
    //   logger,
    //   hourlyIndexer,
    //   syncOptimizer,
    //   indexerService,
    // ),
    createCirculatingSupplyModule(
      config.tvl2,
      logger,
      peripherals,
      hourlyIndexer,
      syncOptimizer,
      indexerService,
    ),
  ]

  const statusRouter = createTvl2StatusRouter(
    config.tvl2,
    modules.map((m) => m.indexers).flat(),
    clock,
  )

  const start = async () => {
    await hourlyIndexer.start()

    for (const module of modules) {
      await module.start()
    }
  }

  return {
    routers: [statusRouter],
    start,
  }
}
