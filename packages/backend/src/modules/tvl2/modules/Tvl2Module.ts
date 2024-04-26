import { assert, Logger } from '@l2beat/backend-tools'
import { AmountConfigEntry, EthereumAddress, PriceConfigEntry, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy, partition } from 'lodash'

import { Config, Tvl2Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../../ApplicationModule'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { Tvl2Controller } from '../api/Tvl2Controller'
import { createTvl2Router } from '../api/Tvl2Router'
import { createTvl2StatusRouter } from '../api/Tvl2StatusRouter'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createChainModules } from './ChainModule'
import { createCirculatingSupplyModule } from './CirculatingSupplyModule'
import { createPriceModule } from './PriceModule'

export function createTvl2Module(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl2) {
    logger.info('Tvl2Module disabled')
    return
  }

  const indexerStateRepository = peripherals.getRepository(
    IndexerStateRepository,
  )
  const configurationsRepository = peripherals.getRepository(
    IndexerConfigurationRepository,
  )
  const indexerService = new IndexerService(
    indexerStateRepository,
    configurationsRepository,
  )

  const syncOptimizer = new SyncOptimizer(clock, {
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceModule = createPriceModule(
    config.tvl2,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
  )

  const chainModules = createChainModules(
    config.tvl2,
    peripherals,
    logger,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
  )

  const circulatingSuppliesModule = createCirculatingSupplyModule(
    config.tvl2,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
  )

  const priceConfigIds = getPriceConfigIds(config.tvl2)

  const perProject = groupBy(config.tvl2.amounts, 'projectId')

  const valueIndexers: ValueIndexer[] = []

  for (const [project, rawConfigs] of Object.entries(perProject)) {
    const configs: AmountConfigEntry[][] = partition(rawConfigs, (c => c.type === 'circulatingSupply'))

    for (const amountsConfig of configs) {
      const priceConfigs = amountsConfig.map(c => {
        const p = priceConfigIds.get(createAssetId(c))
        assert(p)
        return p
      })

      const csIndexers = amountsConfig.flatMap(c => {
        const indexer = circulatingSuppliesModule.indexers.get(createAmountId(c))
        return indexer ?? []
      })

      // todo: check chain modules

      const priceIndexers = priceConfigs.map(c => {
        const indexer = priceModule.indexers.get(createPriceId(c))
        assert(indexer)
        return indexer
      })

      const parents = [...csIndexers, ...priceIndexers]

      const indexer = new ValueIndexer({
        priceRepo: peripherals.getRepository(PriceRepository),
        amountRepo: peripherals.getRepository(AmountRepository),
        valueRepo: peripherals.getRepository(ValueRepository),
        priceConfigs,
        amountConfigs: amountsConfig,
        project: ProjectId(project),
        dataSource: 'coingecko',
        syncOptimizer,
        parents,
        tag: `${project}-coingecko`,
        name: 'value_indexer',
        indexerService,
        logger,
        minHeight: amountsConfig.reduce((prev, curr) => UnixTime.min(prev, curr.sinceTimestamp), amountsConfig[0].sinceTimestamp).toNumber()
      })

      valueIndexers.push(indexer)
    }

  }

  const tvlController = new Tvl2Controller(
    peripherals.getRepository(AmountRepository),
    peripherals.getRepository(PriceRepository),
    config.projects.map((p) => p.projectId),
    config.tvl2,
  )
  const statusRouter = createTvl2StatusRouter(config.tvl2, clock)
  const tvlRouter = createTvl2Router(tvlController, clock)

  const start = async () => {
    await hourlyIndexer.start()

    await priceModule.start()
    for (const module of chainModules) {
      await module.start()
    }

    await circulatingSuppliesModule.start()

    for (const valueIndexer of valueIndexers) {
      await valueIndexer.start()
    }
  }

  return {
    routers: [statusRouter, tvlRouter],
    start,
  }
}

type PriceConfigIdMap = Map<string, PriceConfigEntry>

function getPriceConfigIds(config: Tvl2Config): PriceConfigIdMap {
  const result = new Map<string, PriceConfigEntry>()
  for (const p of config.prices) {
    result.set(createAssetId(p), p)
  }

  return result
}

function createAssetId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}