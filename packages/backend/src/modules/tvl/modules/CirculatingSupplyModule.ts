import { assert, CirculatingSupplyEntry, ProjectId } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { ConfigMapping, createAmountId } from '@l2beat/config'
import { TvlConfig } from '../../../config/Config'
import { CirculatingSupplyIndexer } from '../indexers/CirculatingSupplyIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { TvlDependencies } from './TvlDependencies'

interface CirculatingSupplyModule {
  start: () => Promise<void> | void
}

export function initCirculatingSupplyModule(
  config: TvlConfig,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  dependencies: TvlDependencies,
): CirculatingSupplyModule | undefined {
  const circulatingSupplies = config.amounts.filter(
    (a): a is CirculatingSupplyEntry => a.type === 'circulatingSupply',
  )

  if (circulatingSupplies.length === 0) return undefined

  const { dataIndexers, valueIndexers } = createCirculatingSupplyIndexers(
    config,
    circulatingSupplies,
    configMapping,
    descendantPriceIndexer,
    dependencies,
  )

  return {
    start: async () => {
      for (const indexer of dataIndexers.values()) {
        await indexer.start()
      }

      for (const indexer of valueIndexers) {
        await indexer.start()
      }
    },
  }
}

function createCirculatingSupplyIndexers(
  config: TvlConfig,
  entries: CirculatingSupplyEntry[],
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  dependencies: TvlDependencies,
) {
  const circulatingSupplyService = dependencies.getCirculatingSupplyService()
  const logger = dependencies.logger.tag({ module: 'circulatingSupply' })
  const indexerService = dependencies.getIndexerService()
  const db = dependencies.database
  const hourlyIndexer = dependencies.getHourlyIndexer()
  const syncOptimizer = dependencies.getSyncOptimizer()
  const valueService = dependencies.getValueService()

  const dataIndexers = new Map<string, CirculatingSupplyIndexer>()
  entries.forEach((circulatingSupply) => {
    const indexer = new CirculatingSupplyIndexer({
      logger,
      parents: [hourlyIndexer],
      minHeight: circulatingSupply.sinceTimestamp.toNumber(),
      indexerService,
      configuration: circulatingSupply,
      circulatingSupplyService,
      db,
      syncOptimizer,
    })
    dataIndexers.set(createAmountId(circulatingSupply), indexer)
  })

  const perProject = groupBy(entries, 'project')

  const valueIndexers: ValueIndexer[] = []
  for (const [project, amountConfigs] of Object.entries(perProject)) {
    const priceConfigs = new Set(
      amountConfigs.map((c) => configMapping.getPriceConfigFromAmountConfig(c)),
    )

    const csIndexers = amountConfigs.map((c) => {
      const indexer = dataIndexers.get(createAmountId(c))
      assert(indexer)
      return indexer
    })

    const minHeight = Math.min(
      ...amountConfigs.map((c) => c.sinceTimestamp.toNumber()),
    )
    const maxHeight = Math.max(
      ...amountConfigs.map((c) => c.untilTimestamp?.toNumber() ?? Infinity),
    )

    const indexer = new ValueIndexer({
      valueService,
      db,
      priceConfigs: [...priceConfigs],
      amountConfigs,
      project: ProjectId(project),
      dataSource: 'coingecko',
      syncOptimizer,
      parents: [descendantPriceIndexer, ...csIndexers],
      indexerService,
      logger,
      minHeight,
      maxHeight,
      maxTimestampsToProcessAtOnce: config.maxTimestampsToAggregateAtOnce,
    })

    valueIndexers.push(indexer)
  }

  return { dataIndexers, valueIndexers }
}
