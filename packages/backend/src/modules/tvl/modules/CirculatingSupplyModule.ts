import { Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import { assert, CirculatingSupplyEntry, ProjectId } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { ConfigMapping, createAmountId } from '@l2beat/config'
import { TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { CirculatingSupplyIndexer } from '../indexers/CirculatingSupplyIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { PriceModule } from './PriceModule'

export interface CirculatingSupplyModule {
  start: () => Promise<void> | void
  descendant: DescendantIndexer
}

export function createCirculatingSupplyModule(
  config: TvlConfig,
  logger: Logger,
  peripherals: Peripherals,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  priceModule: PriceModule,
  configMapping: ConfigMapping,
): CirculatingSupplyModule {
  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const circulatingSupplyService = new CirculatingSupplyService({
    coingeckoQueryService,
  })

  const circulatingSupplies = config.amounts.filter(
    (a): a is CirculatingSupplyEntry => a.type === 'circulatingSupply',
  )

  const indexersMap = new Map<string, CirculatingSupplyIndexer>()
  const indexers = circulatingSupplies.map((circulatingSupply) => {
    const indexer = new CirculatingSupplyIndexer({
      logger,
      parents: [hourlyIndexer],
      minHeight: circulatingSupply.sinceTimestamp.toNumber(),
      indexerService,
      configuration: circulatingSupply,
      circulatingSupplyService,
      db: peripherals.database,
      syncOptimizer,
    })
    indexersMap.set(createAmountId(circulatingSupply), indexer)
    return indexer
  })

  const perProject = groupBy(circulatingSupplies, 'project')

  const valueIndexers: ValueIndexer[] = []

  for (const [project, amountConfigs] of Object.entries(perProject)) {
    const priceConfigs = new Set(
      amountConfigs.map((c) => configMapping.getPriceConfigFromAmountConfig(c)),
    )

    const csIndexers = amountConfigs.map((c) => {
      const indexer = indexersMap.get(createAmountId(c))
      assert(indexer)
      return indexer
    })

    const parents = [priceModule.descendant, ...csIndexers]

    const valueService = new ValueService(peripherals.database)

    const minHeight = Math.min(
      ...amountConfigs.map((c) => c.sinceTimestamp.toNumber()),
    )
    const maxHeight = Math.max(
      ...amountConfigs.map((c) => c.untilTimestamp?.toNumber() ?? Infinity),
    )

    const indexer = new ValueIndexer({
      valueService,
      db: peripherals.database,
      priceConfigs: [...priceConfigs],
      amountConfigs,
      project: ProjectId(project),
      dataSource: 'coingecko',
      syncOptimizer,
      parents,
      indexerService,
      logger,
      minHeight,
      maxHeight,
      maxTimestampsToProcessAtOnce: config.maxTimestampsToAggregateAtOnce,
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
