import { Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { PriceIndexer } from '../indexers/PriceIndexer'
import { PriceRepository } from '../repositories/PriceRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface PriceModule {
  indexers: PriceIndexer[]
  start: () => Promise<void> | void
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

  const byCoingeckoId = groupBy(config.prices, (price) => price.coingeckoId)

  const indexers = Object.entries(byCoingeckoId).map(
    ([coingeckoId, prices]) =>
      new PriceIndexer({
        logger: logger.tag(coingeckoId),
        parents: [hourlyIndexer],
        coingeckoQueryService,
        indexerService,
        syncOptimizer,
        priceRepository: peripherals.getRepository(PriceRepository),
        coingeckoId: CoingeckoId(coingeckoId),
        id: `price_indexer_${coingeckoId}`,
        configurations: prices.map((price) => ({
          properties: price,
          minHeight: price.sinceTimestamp.toNumber(),
          maxHeight: price.untilTimestamp?.toNumber() ?? null,
          id: 'a', //TODO
        })),
        encode,
        decode,
      }),
  )

  return {
    indexers,
    start: async () => {
      for (const indexer of indexers) {
        await indexer.start()
      }
    },
  }
}

function encode(value: CoingeckoPriceConfigEntry): string {
  return JSON.stringify({
    address: value.address.toString(),
    chain: value.chain,
    sinceTimestamp: value.sinceTimestamp.toNumber(),
    ...({ untilTimestamp: value.untilTimestamp?.toNumber() } ?? {}),
    type: value.type,
    coingeckoId: value.coingeckoId.toString(),
  })
}

// TODO: validate the config with zod
function decode(value: string): CoingeckoPriceConfigEntry {
  const obj = JSON.parse(value) as {
    address: string
    chain: string
    sinceTimestamp: number
    untilTimestamp?: number
    type: string
    coingeckoId: string
  }

  return {
    address: obj.address === 'native' ? 'native' : EthereumAddress(obj.address),
    chain: obj.chain,
    sinceTimestamp: new UnixTime(obj.sinceTimestamp),
    ...({
      untilTimestamp: obj.untilTimestamp && new UnixTime(obj.untilTimestamp),
    } ?? {}),
    type: obj.type,
    coingeckoId: CoingeckoId(obj.coingeckoId),
  } as CoingeckoPriceConfigEntry
}
