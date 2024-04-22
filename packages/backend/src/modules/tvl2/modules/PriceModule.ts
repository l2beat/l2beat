import { Logger } from '@l2beat/backend-tools'
import { tokenList } from '@l2beat/config'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'

import { Tvl2Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { PriceIndexer } from '../indexers/PriceIndexer'
import { PriceRepository } from '../repositories/PriceRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

interface PriceModule {
  indexers: PriceIndexer[]
  start: () => Promise<void> | void
}

export function createPriceModule(
  config: Tvl2Config,
  logger: Logger,
  peripherals: Peripherals,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
): PriceModule {
  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const indexers = config.prices.map(
    (price) =>
      new PriceIndexer(
        // TODO: write it correctly
        logger.tag(
          `${price.chain}:${
            tokenList.find((t) => t.address === price.address)?.symbol ??
            'native'
          }`,
        ),
        hourlyIndexer,
        coingeckoQueryService,
        peripherals.getRepository(IndexerStateRepository),
        peripherals.getRepository(PriceRepository),
        price,
        syncOptimizer,
      ),
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
