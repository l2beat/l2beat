import { type ConfigMapping, createAmountId } from '@l2beat/backend-shared'
import {
  assert,
  type ElasticChainEther,
  type ElasticChainL2Token,
  ProjectId,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import type { ChainTvlConfig, TvlConfig } from '../../../config/Config'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import type { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ElasticChainIndexer } from '../indexers/ElasticChainIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import type { ElasticChainAmountConfig } from '../indexers/types'
import { ElasticChainService } from '../services/ElasticChainService'
import type { TvlDependencies } from './TvlDependencies'

interface ElasticChainModule {
  start: () => Promise<void> | void
}

export function initElasticChainModule(
  config: TvlConfig,
  dependencies: TvlDependencies,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
): ElasticChainModule | undefined {
  const { dataIndexers, valueIndexers } = createIndexers(
    config,
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
  dependencies: TvlDependencies,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
) {
  const logger = dependencies.logger.tag({ module: 'elasticChain' })
  const indexerService = dependencies.indexerService
  const syncOptimizer = dependencies.syncOptimizer
  const valueService = dependencies.valueService

  const dataIndexers: ElasticChainIndexer[] = []
  const valueIndexers: ValueIndexer[] = []

  for (const chain of config.chains) {
    const elasticChainAmountEntries = config.amounts.filter(
      (a): a is ElasticChainAmountConfig =>
        a.chain === chain.name &&
        (a.type === 'elasticChainL2Token' || a.type === 'elasticChainEther'),
    )

    if (elasticChainAmountEntries.length === 0) {
      continue
    }

    const rpcClient = dependencies.clients.getRpcClient(chain.name)

    const sharedEscrow = config.projects
      .find((p) => p.id === chain.name)
      ?.tvlConfig.escrows.find(
        (e) => e.sharedEscrow && e.sharedEscrow.type === 'ElasticChain',
      )
    assert(
      sharedEscrow && sharedEscrow.sharedEscrow?.type === 'ElasticChain',
      `${chain}: Shared escrow not found`,
    )

    const elasticChainService = new ElasticChainService({
      rpcClient: rpcClient,
      multicallClient: new MulticallClient(rpcClient, chain.multicallConfig),
      bridgeAddress: sharedEscrow.sharedEscrow.l2BridgeAddress,
    })

    const blockTimestampIndexer =
      blockTimestampIndexers && blockTimestampIndexers.get(chain.name)
    assert(
      blockTimestampIndexer,
      'blockTimestampIndexer should be defined for enabled chain',
    )

    const configurations = toConfigurations(chain, elasticChainAmountEntries)

    const elasticChainIndexer = new ElasticChainIndexer({
      logger,
      parents: [blockTimestampIndexer],
      indexerService,
      configurations,
      chain: chain.name,
      elasticChainService,
      serializeConfiguration,
      syncOptimizer,
      db: dependencies.database,
    })

    dataIndexers.push(elasticChainIndexer)

    const perProject = groupBy(elasticChainAmountEntries, 'project')

    for (const [project, amountConfigs] of Object.entries(perProject)) {
      const priceConfigs = new Set(
        amountConfigs.map((c) =>
          configMapping.getPriceConfigFromAmountConfig(c),
        ),
      )

      const minHeight = Math.min(...amountConfigs.map((c) => c.sinceTimestamp))
      const maxHeight = Math.max(
        ...amountConfigs.map((c) => c.untilTimestamp ?? Infinity),
      )

      const indexer = new ValueIndexer({
        valueService,
        db: dependencies.database,
        priceConfigs: [...priceConfigs],
        amountConfigs,
        project: ProjectId(project),
        dataSource: `${chain.name}_elastic_chain`,
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
  chain: ChainTvlConfig,
  elasticChainAmountEntries: ElasticChainAmountConfig[],
) {
  const elasticChainAmountConfigurations = elasticChainAmountEntries.map(
    (a) => ({
      id: createAmountId(a),
      properties: a,
      minHeight:
        a.sinceTimestamp < chain.minBlockTimestamp
          ? chain.minBlockTimestamp
          : a.sinceTimestamp,
      maxHeight: a.untilTimestamp ?? null,
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
    sinceTimestamp: value.sinceTimestamp,
    ...(Object.keys(value).includes('untilTimestamp')
      ? { untilTimestamp: value.untilTimestamp }
      : {}),
    includeInTotal: value.includeInTotal,
    decimals: value.decimals,
    symbol: value.symbol,
    isAssociated: value.isAssociated,
  }
}
