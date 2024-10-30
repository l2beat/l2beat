import { Logger } from '@l2beat/backend-tools'
import { ConfigMapping } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { Providers } from '../../../providers/Providers'
import { Clock } from '../../../tools/Clock'
import { ApplicationModule } from '../../ApplicationModule'
import { TvlCleaner } from '../utils/TvlCleaner'
import { initAggLayerModule } from './AggLayerModule'
import { initBlockTimestampModule } from './BlockTimestampModule'
import { initChainModule } from './ChainModule'
import { initCirculatingSupplyModule } from './CirculatingSupplyModule'
import { initElasticChainModule } from './ElasticChainModule'
import { initPremintedModule } from './PremintedModule'
import { initPriceModule } from './PriceModule'
import { TvlDependencies } from './TvlDependencies'

export function initTvlModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl) {
    logger.info('TvlModule disabled')
    return
  }

  const dependencies = new TvlDependencies(
    peripherals.database,
    clock,
    logger,
    providers,
  )

  const indexerService = dependencies.getIndexerService()
  const syncOptimizer = dependencies.getSyncOptimizer()

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

  const hourlyIndexer = dependencies.getHourlyIndexer()

  assert(config.tvl.prices.length > 0, 'Tokens should be configured')

  const priceModule = initPriceModule(config.tvl, dependencies)

  const circulatingSupplyModule = initCirculatingSupplyModule(
    config.tvl,
    configMapping,
    priceModule.descendant,
    dependencies,
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

  const elasticChainModule = initElasticChainModule(
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
    await elasticChainModule?.start()

    if (config.tvl && config.tvl.tvlCleanerEnabled) {
      tvlCleaner.start()
    }
  }

  return {
    start,
  }
}
