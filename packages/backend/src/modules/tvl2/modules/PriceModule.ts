import { assert, Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import { CoingeckoId, CoingeckoPriceConfigEntry } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { KnexMiddleware } from '../../../peripherals/database/KnexMiddleware'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { PriceIndexer } from '../indexers/PriceIndexer'
import { PriceRepository } from '../repositories/PriceRepository'
import { PriceService } from '../services/PriceService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createPriceId } from '../utils/createPriceId'

export interface PriceModule {
  start: () => Promise<void> | void
  descendant: DescendantIndexer
}

export function createPriceModule(
  config: Tvl2Config,
  logger: Logger,
  peripherals: Peripherals,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
): PriceModule {
  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const priceService = new PriceService({
    coingeckoQueryService,
  })

  const byCoingeckoId = groupBy(config.prices, (price) => price.coingeckoId)

  const indexers = Object.entries(byCoingeckoId).map(
    ([coingeckoId, prices]) =>
      new PriceIndexer({
        logger,
        tag: coingeckoId,
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
        priceRepository: peripherals.getRepository(PriceRepository),
        serializeConfiguration,
        deserializeConfiguration,
        syncOptimizer,
        createDatabaseMiddleware: async () =>
          new KnexMiddleware(peripherals.getRepository(PriceRepository)),
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

function serializeConfiguration(value: CoingeckoPriceConfigEntry): string {
  const obj = {
    ...getBaseEntry(value),
    type: value.type,
    coingeckoId: value.coingeckoId.toString(),
  }

  assert(
    Object.keys(obj).length === Object.keys(value).length,
    `Programmer error: update serialization of price entry: ${JSON.stringify(
      obj,
    )}`,
  )

  return JSON.stringify(obj)
}

function getBaseEntry(value: CoingeckoPriceConfigEntry) {
  return {
    assetId: value.assetId.toString(),
    address: value.address.toString(),
    chain: value.chain,
    sinceTimestamp: value.sinceTimestamp.toNumber(),
    ...(Object.keys(value).includes('untilTimestamp')
      ? { untilTimestamp: value.untilTimestamp?.toNumber() }
      : {}),
  }
}

function deserializeConfiguration(value: string): CoingeckoPriceConfigEntry {
  return CoingeckoPriceConfigEntry.parse(JSON.parse(value))
}
