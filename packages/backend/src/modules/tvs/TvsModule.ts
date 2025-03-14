import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { SyncOptimizer } from '../tvl/utils/SyncOptimizer'
import { TvsPriceIndexer } from './indexers/TvsPriceIndexer'
import type { PriceConfig } from './types'

export function initTvsModule(
  config: Config,
  logger: Logger,
  database: Database,
  providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvs) {
    logger.info('TvsModule disabled')
    return
  }

  logger = logger.tag({ feature: 'tvs', module: 'tvs' })

  logger.info(
    `Tvs config loaded (${config.tvs.projects.length} projects, ${config.tvs.prices.length} price configs, ${config.tvs.amounts.length} amount configs)`,
  )

  const syncOptimizer = new SyncOptimizer(clock)
  const indexerService = new IndexerService(database)
  assert(providers.price)

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceIndexer = new TvsPriceIndexer({
    logger,
    parents: [hourlyIndexer],
    indexerService,
    configurations: config.tvs.prices.map((price) => ({
      // configurationId has to be 12 characters long so we cannot use the priceId directly
      id: price.id,
      minHeight: price.sinceTimestamp,
      maxHeight: price.untilTimestamp ?? null,
      properties: price,
    })),
    serializeConfiguration: (value: PriceConfig) => JSON.stringify(value),
    priceProvider: providers.price,
    syncOptimizer,
    db: database,
  })

  const start = async () => {
    await hourlyIndexer.start()
    await priceIndexer.start()
  }

  return {
    start,
  }
}
