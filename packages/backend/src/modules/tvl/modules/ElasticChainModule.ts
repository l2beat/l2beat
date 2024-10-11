import { Logger } from '@l2beat/backend-tools'
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
import { IndexerService } from '../../../tools/uif/IndexerService'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ElasticChainIndexer } from '../indexers/ElasticChainIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { ElasticChainAmountConfig } from '../indexers/types'
import { ElasticChainService } from '../services/ElasticChainService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

interface ElasticChainModule {
  start: () => Promise<void> | void
}

export function initElasticChainModule(
  config: TvlConfig,
  logger: Logger,
  peripherals: Peripherals,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
): ElasticChainModule | undefined {
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

    const { elasticChainService, valueService } = createPeripherals(
      peripherals,
      chainConfig,
      elasticChainAmountEntries,
    )

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

function createPeripherals(
  peripherals: Peripherals,
  chainConfig: ChainTvlConfig,
  entries: ElasticChainAmountConfig[],
) {
  assert(chainConfig.config)

  const rpcClient = peripherals.getClient(RpcClient, {
    url: chainConfig.config.providerUrl,
    callsPerMinute: chainConfig.config.providerCallsPerMinute,
    chain: chainConfig.chain,
  })

  const bridgeAddress = entries.find(
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

  const valueService = new ValueService(peripherals.database)

  return {
    elasticChainService,
    valueService,
  }
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
