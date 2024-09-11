import { Logger } from '@l2beat/backend-tools'
import { ConfigMapping, createAmountId } from '@l2beat/config'
import {
  BlockExplorerClient,
  CoingeckoClient,
  CoingeckoQueryService,
} from '@l2beat/shared'
import {
  assert,
  AmountConfigEntry,
  EscrowEntry,
  PremintedEntry,
  ProjectId,
  TotalSupplyEntry,
  notUndefined,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ChainTvlConfig, TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { ChainAmountIndexer } from '../indexers/ChainAmountIndexer'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { PremintedIndexer } from '../indexers/PremintedIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { ChainAmountConfig } from '../indexers/types'
import { AmountService } from '../services/AmountService'
import { BlockTimestampProvider } from '../services/BlockTimestampProvider'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { PriceModule } from './PriceModule'

export function createChainModules(
  config: TvlConfig,
  peripherals: Peripherals,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  priceModule: PriceModule,
  configMapping: ConfigMapping,
) {
  return config.chains
    .map((chain) =>
      createChainModule(
        config,
        chain,
        config.amounts,
        peripherals,
        logger,
        hourlyIndexer,
        syncOptimizer,
        indexerService,
        priceModule,
        configMapping,
      ),
    )
    .filter(notUndefined)
}

function createChainModule(
  config: TvlConfig,
  chainConfig: ChainTvlConfig,
  amounts: AmountConfigEntry[],
  peripherals: Peripherals,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  priceModule: PriceModule,
  configMapping: ConfigMapping,
) {
  const chain = chainConfig.chain
  if (!chainConfig.config) {
    logger.tag(chain).info(`Chain module disabled`)
    return
  }

  const {
    blockTimestampProvider,
    amountService,
    valueService,
    circulatingSupplyService,
  } = createPeripherals(peripherals, chainConfig, logger, chain, config)

  const blockTimestampIndexer = new BlockTimestampIndexer({
    logger,
    parents: [hourlyIndexer],
    minHeight: chainConfig.config.minBlockTimestamp.toNumber(),
    indexerService,
    chain,
    blockTimestampProvider,
    db: peripherals.database,
    syncOptimizer,
  })

  const dataIndexers: (ChainAmountIndexer | PremintedIndexer)[] = []
  const valueIndexers: ValueIndexer[] = []

  const chainAmountEntries = amounts
    .filter((a) => a.chain === chain)
    .filter(
      (a): a is ChainAmountConfig =>
        a.type === 'escrow' || a.type === 'totalSupply',
    )

  const chainMinTimestamp = chainConfig.config.minBlockTimestamp
  const chainAmountConfigurations = chainAmountEntries.map((a) => ({
    id: createAmountId(a),
    properties: a,
    minHeight: a.sinceTimestamp.lt(chainMinTimestamp)
      ? chainMinTimestamp.toNumber()
      : a.sinceTimestamp.toNumber(),
    maxHeight: a.untilTimestamp?.toNumber() ?? null,
  }))

  if (chainAmountConfigurations.length > 0) {
    const chainAmountIndexer = new ChainAmountIndexer({
      logger,
      parents: [blockTimestampIndexer],
      indexerService,
      configurations: chainAmountConfigurations,
      chain,
      amountService,
      serializeConfiguration,
      syncOptimizer,
      db: peripherals.database,
    })

    dataIndexers.push(chainAmountIndexer)

    const perProject = groupBy(chainAmountEntries, 'project')

    const parents = [priceModule.descendant, chainAmountIndexer]
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
        dataSource: chain,
        syncOptimizer,
        parents,
        indexerService,
        logger,
        minHeight,
        maxHeight,
        maxTimestampsToProcessAtOnce: config.maxTimestampsToAggregateAtOnce,
      })

      valueIndexers.push(indexer)
    }
  }

  const premintedTokens = amounts
    .filter((a) => a.chain === chain)
    .filter((a): a is PremintedEntry => a.type === 'preminted')

  for (const preminted of premintedTokens) {
    const indexer = new PremintedIndexer({
      logger,
      parents: [blockTimestampIndexer],
      indexerService,
      configuration: preminted,
      minHeight: preminted.sinceTimestamp.toNumber(),
      amountService,
      circulatingSupplyService,
      syncOptimizer,
      db: peripherals.database,
    })

    dataIndexers.push(indexer)

    const valueIndexer = new ValueIndexer({
      valueService,
      db: peripherals.database,
      priceConfigs: [configMapping.getPriceConfigFromAmountConfig(preminted)],
      amountConfigs: [preminted],
      project: ProjectId(preminted.project),
      dataSource: `${chain}_preminted_${preminted.address}`,
      syncOptimizer,
      parents: [priceModule.descendant, indexer],
      indexerService,
      logger,
      minHeight: preminted.sinceTimestamp.toNumber(),
      maxHeight: preminted.untilTimestamp?.toNumber(),
      maxTimestampsToProcessAtOnce: config.maxTimestampsToAggregateAtOnce,
    })

    valueIndexers.push(valueIndexer)
  }

  return dataIndexers.length === 0
    ? undefined
    : {
        start: async () => {
          await blockTimestampIndexer.start()

          for (const dataIndexer of dataIndexers) {
            await dataIndexer.start()
          }

          for (const valueIndexer of valueIndexers) {
            await valueIndexer.start()
          }
        },
      }
}

function createPeripherals(
  peripherals: Peripherals,
  chainConfig: ChainTvlConfig,
  logger: Logger,
  chain: string,
  config: TvlConfig,
) {
  assert(chainConfig.config)

  const rpcClient = peripherals.getClient(RpcClient, {
    url: chainConfig.config.providerUrl,
    callsPerMinute: chainConfig.config.providerCallsPerMinute,
    chain: chainConfig.chain,
  })

  const options =
    chainConfig.config.blockExplorerConfig === undefined
      ? undefined
      : chainConfig.config.blockExplorerConfig.type === 'etherscan'
        ? {
            type: 'Etherscan' as const,
            apiKey: chainConfig.config.blockExplorerConfig.etherscanApiKey,
            url: chainConfig.config.blockExplorerConfig.etherscanApiUrl,
            maximumCallsForBlockTimestamp: 3,
          }
        : {
            type: 'Blockscout' as const,
            url: chainConfig.config.blockExplorerConfig.blockscoutApiUrl,
            maximumCallsForBlockTimestamp: 10,
          }

  const blockExplorerClient = options
    ? peripherals.getClient(BlockExplorerClient, options)
    : undefined

  const blockTimestampProvider = new BlockTimestampProvider({
    blockExplorerClient,
    client: rpcClient,
    logger,
  })

  const amountService = new AmountService({
    rpcClient: rpcClient,
    multicallClient: new MulticallClient(
      rpcClient,
      chainConfig.config.multicallConfig,
    ),
    logger: logger.tag(chain),
  })

  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(
    coingeckoClient,
    logger.tag(chain),
  )

  const circulatingSupplyService = new CirculatingSupplyService({
    coingeckoQueryService,
  })
  const valueService = new ValueService(peripherals.database)
  return {
    blockTimestampProvider,
    amountService,
    valueService,
    circulatingSupplyService,
  }
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
