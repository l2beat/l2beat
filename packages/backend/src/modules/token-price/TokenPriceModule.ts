import type { Indexer } from '@l2beat/uif'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import { SyncOptimizer } from '../tvs/tools/SyncOptimizer'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { TokenPriceIndexer } from './indexers/TokenPriceIndexer'

export interface TokenPriceModule extends ApplicationModule {
  tokenPriceIndexer: Indexer
}

export function initTokenPriceModule({
  config,
  logger,
  db,
  providers,
  clock,
}: ModuleDependencies): TokenPriceModule | undefined {
  if (!config.tokenPrice) {
    logger.info('TokenPriceModule disabled')
    return
  }

  logger = logger.tag({ feature: 'token-price', module: 'token-price' })

  logger.info('TokenPrice config loaded', {
    prices: config.tokenPrice.prices.length,
  })

  const syncOptimizer = new SyncOptimizer(clock)
  const indexerService = new IndexerService(db)

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const tokenPriceIndexer = new TokenPriceIndexer(
    {
      parents: [hourlyIndexer],
      indexerService,
      configurations: config.tokenPrice.prices.map((price) => ({
        // configurationId has to be 12 characters long so we cannot use the priceId directly
        id: price.id,
        minHeight: price.sinceTimestamp,
        maxHeight: price.untilTimestamp ?? null,
        properties: price,
      })),
      priceProvider: providers.price,
      syncOptimizer,
      db: db,
    },
    logger,
  )

  const start = async () => {
    await hourlyIndexer.start()
    await tokenPriceIndexer.start()
  }

  return {
    start,
    tokenPriceIndexer,
  }
}
