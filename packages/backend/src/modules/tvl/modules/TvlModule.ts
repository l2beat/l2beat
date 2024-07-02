import { assert, Logger } from '@l2beat/backend-tools'

import { chains } from '@l2beat/config'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { Config, TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { TvlCleanerRepository } from '../../../peripherals/database/TvlCleanerRepository'
import { ChainConverter } from '../../../tools/ChainConverter'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../../ApplicationModule'
import { createTvlRouter } from '../api/TvlRouter'
import { AggregatedService } from '../api/services/AggregatedService'
import { BreakdownService } from '../api/services/BreakdownService'
import { TokenService } from '../api/services/TokenService'
import { TvlService } from '../api/services/TvlService'
import { AmountsDataService } from '../api/services/data/AmountsDataService'
import { PricesDataService } from '../api/services/data/PricesDataService'
import { ValuesDataService } from '../api/services/data/ValuesDataService'
import { ApiProject, AssociatedToken } from '../api/utils/types'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
import { ConfigMapping } from '../utils/ConfigMapping'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { TvlCleaner } from '../utils/TvlCleaner'
import { createPriceId } from '../utils/createPriceId'
import { createChainModules } from './ChainModule'
import { createCirculatingSupplyModule } from './CirculatingSupplyModule'
import { createPriceModule } from './PriceModule'

export function createTvlModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl) {
    logger.info('TvlModule disabled')
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

  const syncOptimizer = new SyncOptimizer(clock)

  const configMapping = new ConfigMapping(
    config.tvl.prices,
    config.tvl.amounts,
    config.tvl.projects.map((p) => p.projectId),
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceModule = createPriceModule(
    config.tvl,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
  )

  const chainModules = createChainModules(
    config.tvl,
    peripherals,
    logger,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
    priceModule,
    configMapping,
  )

  const circulatingSuppliesModule = createCirculatingSupplyModule(
    config.tvl,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
    priceModule,
    configMapping,
  )

  const ethPrice = config.tvl.prices.find(
    (p) => p.chain === 'ethereum' && p.address === 'native',
  )
  assert(ethPrice, 'Eth priceId not found')

  const valuesDataService = new ValuesDataService({
    valueRepository: peripherals.getRepository(ValueRepository),
    clock,
    logger,
  })

  const pricesDataService = new PricesDataService({
    priceRepository: peripherals.getRepository(PriceRepository),
    clock,
    etherPriceConfig: { ...ethPrice, configId: createPriceId(ethPrice) },
    logger,
  })

  const amountsDataService = new AmountsDataService({
    amountRepository: peripherals.getRepository(AmountRepository),
    configurationRepository: peripherals.getRepository(
      IndexerConfigurationRepository,
    ),
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

  const breakdownService = new BreakdownService({
    pricesDataService,
    amountsDataService,
    configMapping,
    chainConverter,
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
    breakdownService,
    getApiProjects(config.tvl, configMapping),
    getAssociatedTokens(config.tvl, configMapping),
    clock,
  )

  const tvlCleaner = new TvlCleaner(
    clock,
    logger,
    syncOptimizer,
    peripherals.getRepository(TvlCleanerRepository),
    [
      peripherals.getRepository(AmountRepository),
      peripherals.getRepository(BlockTimestampRepository),
      peripherals.getRepository(PriceRepository),
      peripherals.getRepository(ValueRepository),
    ],
  )

  const start = async () => {
    await hourlyIndexer.start()

    await priceModule.start()

    if (config.tvl && config.tvl.tvlCleanerEnabled) {
      tvlCleaner.start()
    }

    for (const module of chainModules) {
      await module.start()
    }

    await circulatingSuppliesModule.start()
  }

  return {
    routers: [tvlRouter],
    start,
  }
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
      const name =
        amount.type === 'circulatingSupply' ? 'coingecko' : amount.chain

      const source = sources.get(name)
      if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
        sources.set(name, { name, minTimestamp: amount.sinceTimestamp })
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
