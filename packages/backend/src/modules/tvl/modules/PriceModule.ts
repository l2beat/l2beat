import { Logger } from '@l2beat/backend-tools'
import { createPriceId } from '@l2beat/config'
import { Database } from '@l2beat/database'
import { CoingeckoId, CoingeckoPriceConfigEntry } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { TvlConfig } from '../../../config/Config'
import { Providers } from '../../../providers/Providers'
import { Clock } from '../../../tools/Clock'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { PriceDependencies } from '../dependencies/PriceDependencies'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { PriceIndexer } from '../indexers/PriceIndexer'
import { SyncOptimizer } from '../utils/SyncOptimizer'

interface PriceModule {
  start: () => Promise<void> | void
  descendant: DescendantIndexer
}

export function initPriceModule(
  config: TvlConfig,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
): PriceModule {
  const dependencies = new PriceDependencies(database, providers)

  const { indexers, descendant } = createPriceIndexers(
    config,
    logger,
    clock,
    dependencies,
  )

  return {
    start: async () => {
      for (const indexer of indexers) {
        await indexer.start()
      }

      await descendant.start()
    },
    descendant,
  }
}

function createPriceIndexers(
  config: TvlConfig,
  logger: Logger,
  clock: Clock,
  dependencies: PriceDependencies,
) {
  const indexerService = new IndexerService(dependencies.database)
  const syncOptimizer = new SyncOptimizer(clock)
  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const priceService = dependencies.getPriceService()

  const byCoingeckoId = groupBy(config.prices, (price) => price.coingeckoId)

  const indexers = Object.entries(byCoingeckoId).map(
    ([coingeckoId, prices]) =>
      new PriceIndexer({
        logger,
        parents: [hourlyIndexer],
        indexerService,
        coingeckoId: CoingeckoId(coingeckoId),
        configurations: prices.map((price) => ({
          properties: price,
          minHeight: price.sinceTimestamp.toNumber(),
          maxHeight: price.untilTimestamp?.toNumber() ?? null,
          id: createPriceId(price),
        })),
        priceService,
        serializeConfiguration,
        syncOptimizer,
        db: dependencies.database,
      }),
  )

  const descendant = new DescendantIndexer({
    logger,
    tag: 'price',
    parents: indexers,
    indexerService,
    minHeight: Math.min(
      ...config.prices.map((price) => price.sinceTimestamp.toNumber()),
    ),
  })

  return { indexers, descendant }
}

function serializeConfiguration(value: CoingeckoPriceConfigEntry): string {
  const obj = {
    ...getBaseEntry(value),
    type: value.type,
    coingeckoId: value.coingeckoId.toString(),
  }

  return JSON.stringify(obj)
}

function getBaseEntry(value: CoingeckoPriceConfigEntry) {
  return {
    ...value,
    assetId: value.assetId.toString(),
    address: value.address.toString(),
    chain: value.chain,
    sinceTimestamp: value.sinceTimestamp.toNumber(),
    ...(Object.keys(value).includes('untilTimestamp')
      ? { untilTimestamp: value.untilTimestamp?.toNumber() }
      : {}),
  }
}
