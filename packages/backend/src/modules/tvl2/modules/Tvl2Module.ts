import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../config/Config'
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
import { ValueRepository } from '../repositories/ValueRepository'
import { IdConverter } from '../utils/IdConverter'
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

  const idConverter = new IdConverter(config.tvl2.prices)

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceModule = createPriceModule(
    config.tvl2,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
  )

  const chainModules = createChainModules(
    config.tvl2,
    peripherals,
    logger,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
    priceModule,
    idConverter,
  )

  const circulatingSuppliesModule = createCirculatingSupplyModule(
    config.tvl2,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
    priceModule,
    idConverter,
  )

  const tvlController = new Tvl2Controller(
    peripherals.getRepository(AmountRepository),
    peripherals.getRepository(PriceRepository),
    peripherals.getRepository(ValueRepository),
    config.tvl2.chainConverter,
    config.tvl2.projects,
    config.tvl2,
  )
  const statusRouter = createTvl2StatusRouter(config.tvl2, clock)
  const tvlRouter = createTvl2Router(tvlController, clock)

  const start = async () => {
    await hourlyIndexer.start()

    await priceModule.start()

    for (const module of chainModules) {
      await module.start()
    }

    await circulatingSuppliesModule.start()
  }

  return {
    routers: [statusRouter, tvlRouter],
    start,
  }
}
