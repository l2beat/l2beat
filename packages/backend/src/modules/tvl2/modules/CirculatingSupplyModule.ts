import { Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import { CirculatingSupplyEntry } from '@l2beat/shared-pure'

import { Tvl2Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { CirculatingSupplyIndexer } from '../indexers/CirculatingSupplyIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface CirculatingSupplyModule {
  indexers: CirculatingSupplyIndexer[]
  start: () => Promise<void> | void
}

export function createCirculatingSupplyModule(
  config: Tvl2Config,
  logger: Logger,
  peripherals: Peripherals,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
): CirculatingSupplyModule {
  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const circulatingSupplies = config.amounts.filter(
    (a): a is CirculatingSupplyEntry => a.type === 'circulatingSupply',
  )

  const indexers = circulatingSupplies.map(
    (circulatingSupply) =>
      new CirculatingSupplyIndexer({
        logger: logger.tag(circulatingSupply.coingeckoId.toString()),
        parents: [hourlyIndexer],
        coingeckoQueryService,
        indexerService,
        circulatingSupplyEntry: circulatingSupply,
        syncOptimizer,
        minHeight: circulatingSupply.sinceTimestamp.toNumber(),
        amountRepository: peripherals.getRepository(AmountRepository),
        id: circulatingSupply.coingeckoId.toString(), //TODO
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
