import { ConfigMapping } from '@l2beat/backend-shared'
import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../../../config/Config'
import type { Providers } from '../../../providers/Providers'
import type { Clock } from '../../../tools/Clock'
import type { ApplicationModule } from '../../ApplicationModule'
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
  database: Database,
  providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl) {
    logger.info('TvlModule disabled')
    return
  }

  logger = logger.tag({ feature: 'tvl', module: 'tvl' })

  const dependencies = new TvlDependencies(database, clock, logger, providers)

  const syncOptimizer = dependencies.syncOptimizer

  const configMapping = new ConfigMapping(
    config.tvl.prices,
    config.tvl.amounts,
    config.tvl.projects.map((p) => p.projectId),
  )

  const tvlCleaner = new TvlCleaner(
    clock,
    logger,
    syncOptimizer,
    dependencies.database,
    [
      dependencies.database.amount,
      dependencies.database.blockTimestamp,
      dependencies.database.price,
      dependencies.database.value,
    ],
  )

  const hourlyIndexer = dependencies.hourlyIndexer

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
    dependencies,
  )

  const chainModule = initChainModule(
    config.tvl,
    dependencies,
    configMapping,
    priceModule.descendant,
    blockTimestampModule?.blockTimestampIndexers,
  )

  const premintedModule = initPremintedModule(
    config.tvl,
    dependencies,
    configMapping,
    priceModule.descendant,
    blockTimestampModule?.blockTimestampIndexers,
  )

  const aggLayerModule = initAggLayerModule(
    config.tvl,
    dependencies,
    configMapping,
    priceModule.descendant,
    blockTimestampModule?.blockTimestampIndexers,
  )

  const elasticChainModule = initElasticChainModule(
    config.tvl,
    dependencies,
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
