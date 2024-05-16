import { assert, Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import {
  CirculatingSupplyEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { CirculatingSupplyIndexer } from '../indexers/CirculatingSupplyIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { ValueService } from '../services/ValueService'
import { IdConverter } from '../utils/IdConverter'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createAmountId } from '../utils/createAmountId'
import { PriceModule } from './PriceModule'

export interface CirculatingSupplyModule {
  start: () => Promise<void> | void
  descendant: DescendantIndexer
}

export function createCirculatingSupplyModule(
  config: Tvl2Config,
  logger: Logger,
  peripherals: Peripherals,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  priceModule: PriceModule,
  idConverter: IdConverter,
): CirculatingSupplyModule {
  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
  const circulatingSupplies = config.amounts.filter(
    (a): a is CirculatingSupplyEntry => a.type === 'circulatingSupply',
  )
  const indexersMap = new Map<string, CirculatingSupplyIndexer>()

  const circulatingSupplyService = new CirculatingSupplyService({
    coingeckoQueryService,
  })

  const indexers = circulatingSupplies.map((circulatingSupply) => {
    const indexer = new CirculatingSupplyIndexer({
      logger,
      tag: circulatingSupply.coingeckoId.toString(),
      parents: [hourlyIndexer],
      minHeight: circulatingSupply.sinceTimestamp.toNumber(),
      indexerService,
      configuration: circulatingSupply,
      circulatingSupplyService,
      amountRepository: peripherals.getRepository(AmountRepository),
      syncOptimizer,
    })
    indexersMap.set(createAmountId(circulatingSupply), indexer)
    return indexer
  })

  const perProject = groupBy(circulatingSupplies, 'project')

  const valueIndexers: ValueIndexer[] = []

  for (const [project, amountConfigs] of Object.entries(perProject)) {
    const priceConfigs = new Set(
      amountConfigs.map((c) => idConverter.getPriceConfigFromAmountConfig(c)),
    )

    const csIndexers = amountConfigs.map((c) => {
      const indexer = indexersMap.get(createAmountId(c))
      assert(indexer)
      return indexer
    })

    const parents = [priceModule.descendant, ...csIndexers]

    const valueService = new ValueService({
      amountRepository: peripherals.getRepository(AmountRepository),
      priceRepository: peripherals.getRepository(PriceRepository),
    })

    const indexer = new ValueIndexer({
      valueService,
      valueRepository: peripherals.getRepository(ValueRepository),
      priceConfigs: [...priceConfigs],
      amountConfigs,
      project: ProjectId(project),
      dataSource: 'coingecko',
      syncOptimizer,
      parents,
      tag: `${project}_coingecko`,
      indexerService,
      logger,
      minHeight: amountConfigs
        .reduce(
          (prev, curr) => UnixTime.min(prev, curr.sinceTimestamp),
          amountConfigs[0].sinceTimestamp,
        )
        .toNumber(),
      maxTimestampsToProcessAtOnce: 48,
    })

    valueIndexers.push(indexer)
  }

  const descendant = new DescendantIndexer({
    logger,
    tag: 'circulating_supply',
    parents: indexers,
    indexerService,
    minHeight: Math.min(
      ...circulatingSupplies.map((cs) => cs.sinceTimestamp.toNumber()),
    ),
  })

  return {
    start: async () => {
      for (const indexer of indexers) {
        await indexer.start()
      }

      for (const indexer of valueIndexers) {
        await indexer.start()
      }

      await descendant.start()
    },
    descendant,
  }
}
