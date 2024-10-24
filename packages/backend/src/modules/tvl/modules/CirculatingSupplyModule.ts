import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient2,
  RetryHandler,
} from '@l2beat/shared'
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

interface CirculatingSupplyModule {
  start: () => Promise<void> | void
}

export function initCirculatingSupplyModule(
  config: TvlConfig,
  logger: Logger,
  peripherals: Peripherals,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  configMapping: ConfigMapping,
  hourlyIndexer: HourlyIndexer,
  descendantPriceIndexer: DescendantIndexer,
): CirculatingSupplyModule | undefined {
  const circulatingSupplies = config.amounts.filter(
    (a): a is CirculatingSupplyEntry => a.type === 'circulatingSupply',
  )

  if (circulatingSupplies.length === 0) return undefined

  const circulatingSupplyService = getDataService(logger, config)

  const dataIndexers = new Map<string, CirculatingSupplyIndexer>()
  circulatingSupplies.forEach((circulatingSupply) => {
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
    dataIndexers.set(createAmountId(circulatingSupply), indexer)
  })

  const perProject = groupBy(circulatingSupplies, 'project')

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
      parents: [descendantPriceIndexer, ...csIndexers],
      indexerService,
      logger,
      minHeight,
      maxHeight,
      maxTimestampsToProcessAtOnce: config.maxTimestampsToAggregateAtOnce,
    })

    valueIndexers.push(indexer)
  }

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

function getDataService(logger: Logger, config: TvlConfig) {
  const coingeckoClient = new CoingeckoClient(
    new HttpClient2(),
    config.coingeckoApiKey,
    RetryHandler.RELIABLE_API(logger),
  )
  const coingeckoQueryService = new CoingeckoQueryService(
    coingeckoClient,
    logger.tag('circulatingSupply'),
  )

  const circulatingSupplyService = new CirculatingSupplyService({
    coingeckoQueryService,
  })
  return circulatingSupplyService
}
