import { Logger } from '@l2beat/backend-tools'
import { ConfigMapping } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { Clock } from '../../../tools/Clock'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { ApplicationModule } from '../../ApplicationModule'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { TvlCleaner } from '../utils/TvlCleaner'
import { initAggLayerModule } from './AggLayerModule'
import { initBlockTimestampModule } from './BlockTimestampModule'
import { initChainModule } from './ChainModule'
import { initCirculatingSupplyModule } from './CirculatingSupplyModule'
import { initPremintedModule } from './PremintedModule'
import { initPriceModule } from './PriceModule'

export function initTvlModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl) {
    logger.info('TvlModule disabled')
    return
  }

  const indexerService = new IndexerService(peripherals.database)

  const syncOptimizer = new SyncOptimizer(clock)

  const configMapping = new ConfigMapping(
    config.tvl.prices,
    config.tvl.amounts,
    config.tvl.projects.map((p) => p.projectId),
  )

  const tvlCleaner = new TvlCleaner(
    clock,
    logger,
    syncOptimizer,
    peripherals.database,
    [
      peripherals.database.amount,
      peripherals.database.blockTimestamp,
      peripherals.database.price,
      peripherals.database.value,
    ],
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  assert(config.tvl.prices.length > 0, 'Tokens should be configured')

  const priceModule = initPriceModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    hourlyIndexer,
  )

  const circulatingSupplyModule = initCirculatingSupplyModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    configMapping,
    hourlyIndexer,
    priceModule.descendant,
  )

  const blockTimestampModule = initBlockTimestampModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    hourlyIndexer,
  )

  const chainModule = initChainModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    configMapping,
    priceModule.descendant,
    blockTimestampModule?.blockTimestampIndexers,
  )

  const premintedModule = initPremintedModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    configMapping,
    priceModule.descendant,
    blockTimestampModule?.blockTimestampIndexers,
  )

  const aggLayerModule = initAggLayerModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    configMapping,
    priceModule.descendant,
    blockTimestampModule?.blockTimestampIndexers,
  )

  const start = async () => {
    await hourlyIndexer.start()
    await priceModule.start()
    await blockTimestampModule?.start()
    await chainModule?.start()
    await premintedModule?.start()
    await circulatingSupplyModule?.start()
    await aggLayerModule?.start()

    if (config.tvl && config.tvl.tvlCleanerEnabled) {
      tvlCleaner.start()
    }
  }

  return {
    start,
  }
}
