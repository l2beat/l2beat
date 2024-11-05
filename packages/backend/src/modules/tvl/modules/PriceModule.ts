import { createPriceId } from '@l2beat/config'
import { CoingeckoId, CoingeckoPriceConfigEntry } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { TvlConfig } from '../../../config/Config'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { PriceIndexer } from '../indexers/PriceIndexer'
import { TvlDependencies } from './TvlDependencies'

interface PriceModule {
  start: () => Promise<void> | void
  descendant: DescendantIndexer
}

export function initPriceModule(
  config: TvlConfig,
  dependencies: TvlDependencies,
): PriceModule {
  const { indexers, descendant } = createPriceIndexers(config, dependencies)

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

function createPriceIndexers(config: TvlConfig, dependencies: TvlDependencies) {
  const indexerService = dependencies.getIndexerService()
  const syncOptimizer = dependencies.getSyncOptimizer()
  const priceService = dependencies.getPriceService()
  const hourlyIndexer = dependencies.getHourlyIndexer()
  const logger = dependencies.logger

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
