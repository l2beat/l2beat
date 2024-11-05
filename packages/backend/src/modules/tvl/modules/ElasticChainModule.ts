import { ConfigMapping, createAmountId } from '@l2beat/config'
import {
  assert,
  ElasticChainEther,
  ElasticChainL2Token,
  ProjectId,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ChainTvlConfig, TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ElasticChainIndexer } from '../indexers/ElasticChainIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { ElasticChainAmountConfig } from '../indexers/types'
import { ElasticChainService } from '../services/ElasticChainService'
import { TvlDependencies } from './TvlDependencies'

interface ElasticChainModule {
  start: () => Promise<void> | void
}

export function initElasticChainModule(
  config: TvlConfig,
  peripherals: Peripherals,
  dependencies: TvlDependencies,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
): ElasticChainModule | undefined {
  const { dataIndexers, valueIndexers } = createIndexers(
    config,
    peripherals,
    dependencies,
    configMapping,
    descendantPriceIndexer,
    blockTimestampIndexers,
  )
  if (dataIndexers.length === 0) return undefined

  return {
    start: async () => {
      for (const dataIndexer of dataIndexers) {
        await dataIndexer.start()
      }

      for (const valueIndexer of valueIndexers) {
        await valueIndexer.start()
      }
    },
  }
}

function createIndexers(
  config: TvlConfig,
  peripherals: Peripherals,
  dependencies: TvlDependencies,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
) {
  const logger = dependencies.logger
  const indexerService = dependencies.getIndexerService()
  const syncOptimizer = dependencies.getSyncOptimizer()
  const valueService = dependencies.getValueService()

  const dataIndexers: ElasticChainIndexer[] = []
  const valueIndexers: ValueIndexer[] = []

  for (const chainConfig of config.chains) {
    const chain = chainConfig.chain
    if (!chainConfig.config) {
      continue
    }

    const elasticChainAmountEntries = config.amounts.filter(
      (a): a is ElasticChainAmountConfig =>
        a.chain === chain &&
        (a.type === 'elasticChainL2Token' || a.type === 'elasticChainEther'),
    )

    if (elasticChainAmountEntries.length === 0) {
      continue
    }

    const rpcClient = peripherals.getClient(RpcClient, {
      url: chainConfig.config.providerUrl,
      callsPerMinute: chainConfig.config.providerCallsPerMinute,
      chain: chainConfig.chain,
    })

    const bridgeAddress = elasticChainAmountEntries.find(
      (e) => e.type === 'elasticChainL2Token',
    )?.l2BridgeAddress
    assert(bridgeAddress, 'Bridge address not found')

    const elasticChainService = new ElasticChainService({
      rpcClient: rpcClient,
      multicallClient: new MulticallClient(
        rpcClient,
        chainConfig.config.multicallConfig,
      ),
      bridgeAddress,
    })

    const blockTimestampIndexer =
      blockTimestampIndexers && blockTimestampIndexers.get(chain)
    assert(
      blockTimestampIndexer,
      'blockTimestampIndexer should be defined for enabled chain',
    )

    const configurations = toConfigurations(
      chainConfig,
      elasticChainAmountEntries,
    )

    const elasticChainIndexer = new ElasticChainIndexer({
      logger,
      parents: [blockTimestampIndexer],
      indexerService,
      configurations,
      chain,
      elasticChainService,
      serializeConfiguration,
      syncOptimizer,
      db: peripherals.database,
    })

    dataIndexers.push(elasticChainIndexer)

    const perProject = groupBy(elasticChainAmountEntries, 'project')

    for (const [project, amountConfigs] of Object.entries(perProject)) {
      const priceConfigs = new Set(
        amountConfigs.map((c) =>
          configMapping.getPriceConfigFromAmountConfig(c),
        ),
      )

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
        dataSource: `${chain}_elastic_chain`,
        syncOptimizer,
        parents: [descendantPriceIndexer, elasticChainIndexer],
        indexerService,
        logger,
        minHeight,
        maxHeight,
        maxTimestampsToProcessAtOnce: config.maxTimestampsToAggregateAtOnce,
      })
      valueIndexers.push(indexer)
    }
  }

  return { dataIndexers, valueIndexers }
}

function toConfigurations(
  chainConfig: ChainTvlConfig,
  elasticChainAmountEntries: ElasticChainAmountConfig[],
) {
  assert(chainConfig.config)
  const chainMinTimestamp = chainConfig.config.minBlockTimestamp
  const elasticChainAmountConfigurations = elasticChainAmountEntries.map(
    (a) => ({
      id: createAmountId(a),
      properties: a,
      minHeight: a.sinceTimestamp.lt(chainMinTimestamp)
        ? chainMinTimestamp.toNumber()
        : a.sinceTimestamp.toNumber(),
      maxHeight: a.untilTimestamp?.toNumber() ?? null,
    }),
  )
  return elasticChainAmountConfigurations
}

function serializeConfiguration(
  value: ElasticChainL2Token | ElasticChainEther,
): string {
  if (value.type === 'elasticChainL2Token') {
    const obj = {
      ...getBaseEntry(value),
      l1Address: value.l1Address.toString(),
      escrowAddress: value.escrowAddress.toString(),
      originNetwork: value.l2BridgeAddress,
      type: value.type,
    }

    return JSON.stringify(obj)
  }

  if (value.type === 'elasticChainEther') {
    const obj = {
      ...getBaseEntry(value),
      l2BridgeAddress: value.address.toString(),
      escrowAddress: value.escrowAddress.toString(),
      type: value.type,
    }

    return JSON.stringify(obj)
  }

  throw new Error('Unknown type')
}

function getBaseEntry(value: ElasticChainL2Token | ElasticChainEther) {
  return {
    ...value,
    chain: value.chain,
    project: value.project.toString(),
    source: value.source,
    sinceTimestamp: value.sinceTimestamp.toNumber(),
    ...(Object.keys(value).includes('untilTimestamp')
      ? { untilTimestamp: value.untilTimestamp?.toNumber() }
      : {}),
    includeInTotal: value.includeInTotal,
    decimals: value.decimals,
    symbol: value.symbol,
    isAssociated: value.isAssociated,
  }
}
