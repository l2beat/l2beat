import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Indexer } from '@l2beat/uif'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { SyncOptimizer } from '../tvl/utils/SyncOptimizer'
import { BlockTimestampIndexer } from './indexers/BlockTimestampIndexer'
import {
  type OnchainAmountConfig,
  OnchainAmountIndexer,
} from './indexers/OnchainAmountIndexer'
import { TvsPriceIndexer } from './indexers/TvsPriceIndexer'
import { createAmountConfig } from './tools/extractPricesAndAmounts'
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

  logger.info(`TVS config loaded`, {
    projects: config.tvs.projects.length,
    prices: config.tvs.prices.length,
    amounts: config.tvs.amounts.length,
    chains: config.tvs.chains.length,
  })

  const syncOptimizer = new SyncOptimizer(clock)
  const indexerService = new IndexerService(database)

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

  const indexers: Indexer[] = []

  for (const chain of config.tvs.chains) {
    const blockTimestampIndexer = new BlockTimestampIndexer({
      syncOptimizer,
      blockTimestampProvider: providers.blockTimestamp,
      parents: [hourlyIndexer],
      indexerService,
      configurations: [
        {
          id: chain.configurationId,
          minHeight: chain.sinceTimestamp,
          maxHeight: chain.untilTimestamp ?? null,
          properties: { chain: chain.name },
        },
      ],
      serializeConfiguration: (value) => JSON.stringify(value),
      db: database,
      logger,
    })
    indexers.push(blockTimestampIndexer)

    const configurations = config.tvs.amounts.filter(
      (a) =>
        a.chain === chain.name &&
        (a.type === 'totalSupply' || a.type === 'balanceOfEscrow'),
    ) as OnchainAmountConfig[]

    const amountIndexer = new OnchainAmountIndexer({
      syncOptimizer,
      chain: chain.name,
      totalSupplyProvider: providers.totalSupply,
      balanceProvider: providers.balance,
      parents: [blockTimestampIndexer],
      indexerService,
      configurations: configurations.map((c) => ({
        id: createAmountConfig(c).id,
        minHeight: c.sinceTimestamp,
        maxHeight: c.untilTimestamp ?? null,
        properties: c,
      })),
      serializeConfiguration: (value) => JSON.stringify(value),
      db: database,
      logger,
    })
    indexers.push(amountIndexer)
  }

  const start = async () => {
    await hourlyIndexer.start()
    await priceIndexer.start()

    for (const indexer of indexers) {
      await indexer.start()
    }
  }

  return {
    start,
  }
}
