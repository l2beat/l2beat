import { type ConfigMapping, createAmountId } from '@l2beat/backend-shared'
import {
  assert,
  type EscrowEntry,
  ProjectId,
  type TotalSupplyEntry,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import type { ChainTvlConfig, TvlConfig } from '../../../config/Config'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { ChainAmountIndexer } from '../indexers/ChainAmountIndexer'
import type { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import type { ChainAmountConfig } from '../indexers/types'
import { AmountService } from '../services/AmountService'
import type { TvlDependencies } from './TvlDependencies'

interface ChainModule {
  start: () => Promise<void> | void
}

export function initChainModule(
  config: TvlConfig,
  dependencies: TvlDependencies,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
): ChainModule | undefined {
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
  const logger = dependencies.logger.tag({ module: 'chain' })
  const indexerService = dependencies.indexerService
  const syncOptimizer = dependencies.syncOptimizer
  const db = dependencies.database
  const valueService = dependencies.valueService

  const dataIndexers: ChainAmountIndexer[] = []
  const valueIndexers: ValueIndexer[] = []

  for (const chain of config.chains) {
    const chainAmountEntries = config.amounts.filter(
      (a): a is ChainAmountConfig =>
        a.chain === chain.name &&
        (a.type === 'escrow' || a.type === 'totalSupply'),
    )

    if (chainAmountEntries.length === 0) {
      continue
    }

    const rpcClient = dependencies.clients.getRpcClient(chain.name)

    const amountService = new AmountService({
      rpcClient: rpcClient,
      multicallClient: new MulticallClient(rpcClient, chain.multicallConfig),
      logger: logger.tag({ tag: chain.name, chain: chain.name }),
    })

    const blockTimestampIndexer =
      blockTimestampIndexers && blockTimestampIndexers.get(chain.name)
    assert(
      blockTimestampIndexer,
      'blockTimestampIndexer should be defined for enabled chain',
    )

    const configurations = toConfigurations(chain, chainAmountEntries)

    const chainAmountIndexer = new ChainAmountIndexer({
      logger,
      parents: [blockTimestampIndexer],
      indexerService,
      configurations,
      chain: chain.name,
      amountService,
      serializeConfiguration,
      syncOptimizer,
      db,
    })

    dataIndexers.push(chainAmountIndexer)

    const perProject = groupBy(chainAmountEntries, 'project')

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
        db,
        priceConfigs: [...priceConfigs],
        amountConfigs,
        project: ProjectId(project),
        dataSource: chain.name,
        syncOptimizer,
        parents: [descendantPriceIndexer, chainAmountIndexer],
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
  chainAmountEntries: ChainAmountConfig[],
) {
  const chainAmountConfigurations = chainAmountEntries.map((a) => ({
    id: createAmountId(a),
    properties: a,
    minHeight: a.sinceTimestamp.lt(chain.minBlockTimestamp)
      ? chain.minBlockTimestamp.toNumber()
      : a.sinceTimestamp.toNumber(),
    maxHeight: a.untilTimestamp?.toNumber() ?? null,
  }))
  return chainAmountConfigurations
}

function serializeConfiguration(value: EscrowEntry | TotalSupplyEntry): string {
  if (value.type === 'escrow') {
    const obj = {
      ...getBaseEntry(value),
      address: value.address.toString(),
      escrowAddress: value.escrowAddress.toString(),
      type: value.type,
    }

    return JSON.stringify(obj)
  }

  if (value.type === 'totalSupply') {
    const obj = {
      ...getBaseEntry(value),
      address: value.address.toString(),
      type: value.type,
    }

    return JSON.stringify(obj)
  }

  throw new Error('Unknown type')
}

function getBaseEntry(value: EscrowEntry | TotalSupplyEntry) {
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
