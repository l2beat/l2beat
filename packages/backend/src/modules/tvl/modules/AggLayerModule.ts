import { Logger } from '@l2beat/backend-tools'
import {
  AGGLAYER_L2BRIDGE_ADDRESS,
  ConfigMapping,
  createAmountId,
} from '@l2beat/config'
import {
  assert,
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  ProjectId,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ChainTvlConfig, TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { AggLayerIndexer } from '../indexers/AggLayerIndexer'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { AggLayerAmountConfig } from '../indexers/types'
import { AggLayerService } from '../services/AggLayerService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

interface AggLayerModule {
  start: () => Promise<void> | void
}

export function initAggLayerModule(
  config: TvlConfig,
  logger: Logger,
  peripherals: Peripherals,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
): AggLayerModule | undefined {
  const dataIndexers: AggLayerIndexer[] = []
  const valueIndexers: ValueIndexer[] = []

  for (const chainConfig of config.chains) {
    const chain = chainConfig.chain
    if (!chainConfig.config) {
      continue
    }

    const aggLayerAmountEntries = config.amounts.filter(
      (a): a is AggLayerAmountConfig =>
        a.chain === chain &&
        (a.type === 'aggLayerL2Token' ||
          a.type === 'aggLayerNativeEtherPreminted' ||
          a.type === 'aggLayerNativeEtherWrapped'),
    )

    if (aggLayerAmountEntries.length === 0) {
      continue
    }

    const { aggLayerService, valueService } = createPeripherals(
      peripherals,
      chainConfig,
    )

    const blockTimestampIndexer =
      blockTimestampIndexers && blockTimestampIndexers.get(chain)
    assert(
      blockTimestampIndexer,
      'blockTimestampIndexer should be defined for enabled chain',
    )

    const configurations = toConfigurations(chainConfig, aggLayerAmountEntries)

    const aggLayerIndexer = new AggLayerIndexer({
      logger,
      parents: [blockTimestampIndexer],
      indexerService,
      configurations,
      chain,
      aggLayerService,
      serializeConfiguration,
      syncOptimizer,
      db: peripherals.database,
    })

    dataIndexers.push(aggLayerIndexer)

    const perProject = groupBy(aggLayerAmountEntries, 'project')

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
        dataSource: `${chain}_agglayer`,
        syncOptimizer,
        parents: [descendantPriceIndexer, aggLayerIndexer],
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
  aggLayerAmountEntries: AggLayerAmountConfig[],
) {
  assert(chainConfig.config)
  const chainMinTimestamp = chainConfig.config.minBlockTimestamp
  const aggLayerAmountConfigurations = aggLayerAmountEntries.map((a) => ({
    id: createAmountId(a),
    properties: a,
    minHeight: a.sinceTimestamp.lt(chainMinTimestamp)
      ? chainMinTimestamp.toNumber()
      : a.sinceTimestamp.toNumber(),
    maxHeight: a.untilTimestamp?.toNumber() ?? null,
  }))
  return aggLayerAmountConfigurations
}

function createPeripherals(
  peripherals: Peripherals,
  chainConfig: ChainTvlConfig,
) {
  assert(chainConfig.config)

  const rpcClient = peripherals.getClient(RpcClient, {
    url: chainConfig.config.providerUrl,
    callsPerMinute: chainConfig.config.providerCallsPerMinute,
    chain: chainConfig.chain,
  })

  const aggLayerService = new AggLayerService({
    rpcClient: rpcClient,
    multicallClient: new MulticallClient(
      rpcClient,
      chainConfig.config.multicallConfig,
    ),
    bridgeAddress: AGGLAYER_L2BRIDGE_ADDRESS,
  })

  const valueService = new ValueService(peripherals.database)

  return {
    aggLayerService,
    valueService,
  }
}

function serializeConfiguration(
  value:
    | AggLayerL2Token
    | AggLayerNativeEtherPreminted
    | AggLayerNativeEtherWrapped,
): string {
  if (value.type === 'aggLayerL2Token') {
    const obj = {
      ...getBaseEntry(value),
      l1Address: value.l1Address.toString(),
      originNetwork: value.originNetwork,
      escrowAddress: value.escrowAddress.toString(),
      type: value.type,
    }

    return JSON.stringify(obj)
  }

  if (value.type === 'aggLayerNativeEtherPreminted') {
    const obj = {
      ...getBaseEntry(value),
      l2BridgeAddress: value.l2BridgeAddress.toString(),
      premintedAmount: value.premintedAmount.toString(),
      escrowAddress: value.escrowAddress.toString(),
      type: value.type,
    }

    return JSON.stringify(obj)
  }

  if (value.type === 'aggLayerNativeEtherWrapped') {
    const obj = {
      ...getBaseEntry(value),
      wethAddress: value.wethAddress.toString(),
      escrowAddress: value.escrowAddress.toString(),
      type: value.type,
    }

    return JSON.stringify(obj)
  }

  throw new Error('Unknown type')
}

function getBaseEntry(
  value:
    | AggLayerL2Token
    | AggLayerNativeEtherPreminted
    | AggLayerNativeEtherWrapped,
) {
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
