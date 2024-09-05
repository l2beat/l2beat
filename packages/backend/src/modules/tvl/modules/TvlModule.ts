import { Logger } from '@l2beat/backend-tools'

import { ConfigMapping, chains, createPriceId } from '@l2beat/config'
import { assert, ChainConverter, ChainId, UnixTime } from '@l2beat/shared-pure'
import { Config, TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { Clock } from '../../../tools/Clock'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { ApplicationModule } from '../../ApplicationModule'
import { createTvlRouter } from '../api/TvlRouter'
import { AggregatedService } from '../api/services/AggregatedService'
import { TokenService } from '../api/services/TokenService'
import { TvlService } from '../api/services/TvlService'
import { AmountsDataService } from '../api/services/data/AmountsDataService'
import { DataStatusService } from '../api/services/data/DataStatusService'
import { PricesDataService } from '../api/services/data/PricesDataService'
import { ValuesDataService } from '../api/services/data/ValuesDataService'
import { ApiProject, AssociatedToken } from '../api/utils/types'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { TvlCleaner } from '../utils/TvlCleaner'
import { initBlockTimestampModule } from './BlockTimestampModule'
import { initChainModule } from './ChainModule'
import { initCirculatingSupplyModule } from './CirculatingSupplyModule'
import { initPremintedModule } from './PremintedModule'
import { initPriceModule } from './PriceModule'

export function initTvlModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl) {
    logger.info('TvlModule disabled')
    return
  }

  const indexerService = new IndexerService(peripherals.database)

  const syncOptimizer = new SyncOptimizer(clock)

  const configMapping = new ConfigMapping(
    config.tvl.prices,
    config.tvl.amounts,
    config.tvl.projects.map((p) => p.projectId),
  )

  const tvlCleaner = new TvlCleaner(
    clock,
    logger,
    syncOptimizer,
    peripherals.database,
    [
      peripherals.database.amount,
      peripherals.database.blockTimestamp,
      peripherals.database.price,
      peripherals.database.value,
    ],
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceModule = initPriceModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    hourlyIndexer,
  )

  const blockTimestampModule = initBlockTimestampModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    hourlyIndexer,
  )

  const chainModule = initChainModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    configMapping,
    priceModule.descendant,
    blockTimestampModule.blockTimestampIndexers,
  )

  const premintedModule = initPremintedModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    configMapping,
    priceModule.descendant,
    blockTimestampModule.blockTimestampIndexers,
  )

  const circulatingSupplyModule = initCirculatingSupplyModule(
    config.tvl,
    logger,
    peripherals,
    syncOptimizer,
    indexerService,
    configMapping,
    hourlyIndexer,
    priceModule.descendant,
  )

  const dataStatusService = new DataStatusService(peripherals.database)

  const pricesDataService = new PricesDataService({
    db: peripherals.database,
    dataStatusService,
    clock,
    etherPriceConfig: getEtherPriceConfig(config.tvl),
    logger,
  })

  const amountsDataService = new AmountsDataService({
    db: peripherals.database,
    dataStatusService,
    clock,
    logger,
  })

  const valuesDataService = new ValuesDataService({
    db: peripherals.database,
    indexerService,
    clock,
    logger,
  })

  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )

  const tokenService = new TokenService({
    amountsDataService,
    pricesDataService,
    configMapping,
    clock,
  })

  const aggregatedService = new AggregatedService({
    valuesDataService,
    pricesDataService,
    clock,
    tokenService,
  })

  const tvlService = new TvlService({
    valuesDataService,
    pricesDataService,
    amountsDataService,
    tokenService,
    clock,
    configMapping,
    chainConverter,
  })

  const tvlRouter = createTvlRouter(
    tvlService,
    aggregatedService,
    tokenService,
    getApiProjects(config.tvl, configMapping),
    getAssociatedTokens(config.tvl, configMapping),
    clock,
  )

  const start = async () => {
    await hourlyIndexer.start()
    await priceModule.start()
    await blockTimestampModule.start()
    await chainModule.start()
    await premintedModule.start()
    await circulatingSupplyModule.start()

    if (config.tvl && config.tvl.tvlCleanerEnabled) {
      tvlCleaner.start()
    }
  }

  return {
    routers: [tvlRouter],
    start,
  }
}

function getEtherPriceConfig(config: TvlConfig) {
  const ethPrice = config.prices.find(
    (p) => p.chain === 'ethereum' && p.address === 'native',
  )
  assert(ethPrice, 'Eth priceId not found')
  const etherPriceConfig = { ...ethPrice, configId: createPriceId(ethPrice) }
  return etherPriceConfig
}

function getApiProjects(
  config: TvlConfig,
  configMapping: ConfigMapping,
): ApiProject[] {
  return config.projects.flatMap(({ projectId, type, slug }) => {
    if (config.projectsExcludedFromApi.includes(projectId.toString())) {
      return []
    }

    const amounts = configMapping.getAmountsByProject(projectId)
    if (!amounts) {
      return []
    }
    assert(amounts, 'Config not found: ' + projectId.toString())
    const minTimestamp = amounts
      .map((x) => x.sinceTimestamp)
      .reduce((a, b) => UnixTime.min(a, b), UnixTime.now())

    const sources = new Map<string, { name: string; minTimestamp: UnixTime }>()
    for (const amount of amounts) {
      const source = sources.get(amount.dataSource)
      if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
        sources.set(amount.dataSource, {
          name: amount.dataSource,
          minTimestamp: amount.sinceTimestamp,
        })
      }
    }
    return { id: projectId, minTimestamp, type, slug, sources }
  })
}

function getAssociatedTokens(
  config: TvlConfig,
  configMapping: ConfigMapping,
): AssociatedToken[] {
  return config.projects.flatMap(({ projectId, type }) => {
    if (config.projectsExcludedFromApi.includes(projectId.toString())) {
      return []
    }

    const amounts = configMapping.getAmountsByProject(projectId)
    if (!amounts) {
      return []
    }

    const uniqueTokens = new Map<string, string>()

    const associatedAmounts = amounts
      .filter((x) => x.isAssociated === true)
      .filter((amount) => {
        const u = uniqueTokens.get(`${amount.address}-${amount.chain}`)
        if (u) {
          assert(amount.source === u, 'Type mismatch')
          return false
        }
        uniqueTokens.set(`${amount.address}-${amount.chain}`, amount.source)
        return true
      })

    return associatedAmounts.map((amount) => {
      return {
        address: amount.address,
        chain: amount.chain,
        type: amount.source,
        includeInTotal: amount.includeInTotal,
        project: projectId,
        projectType: getType(type),
      }
    })
  })
}

function getType(type: 'layer2' | 'bridge' | 'layer3'): 'layers2s' | 'bridges' {
  switch (type) {
    case 'layer2':
      return 'layers2s'
    case 'bridge':
      return 'bridges'
    case 'layer3':
      return 'layers2s'
  }
}
