import { assert, Logger } from '@l2beat/backend-tools'

import { Project, chains } from '@l2beat/config'
import { AssetId, ChainId, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { Config, Tvl2Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { TvlCleanerRepository } from '../../../peripherals/database/TvlCleanerRepository'
import { ChainConverter } from '../../../tools/ChainConverter'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../../ApplicationModule'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { Tvl2Controller } from '../api/Tvl2Controller'
import { createTvl2Router } from '../api/Tvl2Router'
import { createTvl2StatusRouter } from '../api/Tvl2StatusRouter'
import { AmountRepository } from '../repositories/AmountRepository'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
import { IdConverter } from '../utils/IdConverter'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createAmountId } from '../utils/createAmountId'
import { createAssetId } from '../utils/createAssetId'
import { createPriceId } from '../utils/createPriceId'
import { createChainModules } from './ChainModule'
import { createCirculatingSupplyModule } from './CirculatingSupplyModule'
import { createPriceModule } from './PriceModule'
import { TvlCleaner } from './TvlCleaner'

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

  const syncOptimizer = new SyncOptimizer(clock)

  const idConverter = new IdConverter(config.tvl2.prices)

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
    priceModule,
    idConverter,
  )

  const circulatingSuppliesModule = createCirculatingSupplyModule(
    config.tvl2,
    logger,
    peripherals,
    hourlyIndexer,
    syncOptimizer,
    indexerService,
    priceModule,
    idConverter,
  )

  const controllerService = new ControllerService({
    amountRepository: peripherals.getRepository(AmountRepository),
    priceRepository: peripherals.getRepository(PriceRepository),
    valueRepository: peripherals.getRepository(ValueRepository),
    syncOptimizer,
    logger,
  })

  const controllerDependencies = getControllerDependencies(
    config.tvl2,
    controllerService,
    new ChainConverter(
      chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
    ),
  )

  const tvlController = new Tvl2Controller(controllerDependencies)
  const statusRouter = createTvl2StatusRouter(config.tvl2, clock)
  const tvlRouter = createTvl2Router(tvlController, clock)

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

    if (config.tvl2 && config.tvl2.tvlCleanerEnabled) {
      tvlCleaner.start()
    }

    for (const module of chainModules) {
      await module.start()
    }

    await circulatingSuppliesModule.start()
  }

  return {
    routers: [statusRouter, tvlRouter],
    start,
  }
}

function getControllerDependencies(
  config: Tvl2Config,
  controllerService: ControllerService,
  chainConverter: ChainConverter,
): Tvl2ControllerDependencies {
  const amountConfig = getAmountConfigMap(config)
  const currAmountConfigs = new Map(
    [...amountConfig.values()]
      .flat()
      // TODO: we should check it on runtime as well
      .filter((x) => !x.untilTimestamp)
      .map((x) => [x.configId, x]),
  )
  const priceConfigs = getPriceConfigIds(config)
  const projects = config.projects.flatMap(({ projectId: id, type, slug }) => {
    if (config.projectsExcludedFromApi.includes(id.toString())) {
      return []
    }

    const amounts = amountConfig.get(id)
    if (!amounts) {
      return []
    }
    assert(amounts, 'Config not found: ' + id.toString())
    const minTimestamp = amounts
      .map((x) => x.sinceTimestamp)
      .reduce((a, b) => UnixTime.min(a, b))

    const sources = new Map<string, { name: string; minTimestamp: UnixTime }>()
    for (const amount of amounts) {
      const name =
        amount.type === 'circulatingSupply' ? 'coingecko' : amount.chain

      const source = sources.get(name)
      if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
        sources.set(name, { name, minTimestamp: amount.sinceTimestamp })
      }
    }
    return { id, minTimestamp, type, slug, sources }
  })

  const associatedTokens = config.projects.flatMap(
    ({ projectId: id, type }) => {
      if (config.projectsExcludedFromApi.includes(id.toString())) {
        return []
      }

      const amounts = amountConfig.get(id)
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
          project: id,
          projectType: getType(type),
        }
      })
    },
  )

  const minTimestamp = {
    layer2: getMinTimestamp(projects, 'layer2'),
    bridge: getMinTimestamp(projects, 'bridge'),
    layer3: getMinTimestamp(projects, 'layer3'),
  }

  return {
    amountConfig,
    currAmountConfigs,
    priceConfigs,
    projects,
    associatedTokens,
    minTimestamp,
    controllerService,
    chainConverter,
  }
}

function getAmountConfigMap(config: Tvl2Config) {
  const groupedEntries = Object.entries(groupBy(config.amounts, 'project'))
  const amountConfigEntries = groupedEntries.map(([k, v]) => {
    const projectId = ProjectId(k)
    const amountWithIds = v.map((x) => ({ ...x, configId: createAmountId(x) }))

    return [projectId, amountWithIds] as const
  })

  return new Map(amountConfigEntries)
}

function getPriceConfigIds(config: Tvl2Config): PriceConfigIdMap {
  const result = new Map<string, { assetId: AssetId; priceId: string }>()
  for (const p of config.prices) {
    result.set(createAssetId(p), {
      priceId: createPriceId(p),
      assetId: p.assetId,
    })
  }

  return result
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

function getMinTimestamp(projects: ApiProject[], type: Project['type']) {
  return projects
    .filter((x) => x.type === type)
    .map((x) => x.minTimestamp)
    .reduce((acc, curr) => {
      return UnixTime.min(acc, curr)
    })
    .toEndOf('day')
}
