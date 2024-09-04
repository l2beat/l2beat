import { Logger } from '@l2beat/backend-tools'
import { ConfigMapping, createAmountId } from '@l2beat/config'
import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import {
  assert,
  EscrowEntry,
  ProjectId,
  TotalSupplyEntry,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ChainTvlConfig, TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { ChainAmountIndexer } from '../indexers/ChainAmountIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { ChainAmountConfig } from '../indexers/types'
import { AmountService } from '../services/AmountService'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

interface ChainModule {
  start: () => Promise<void> | void
}

export function initChainModule(
  config: TvlConfig,
  peripherals: Peripherals,
  logger: Logger,
  blockTimestampIndexers: Map<string, BlockTimestampIndexer>,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  descendantPriceIndexer: DescendantIndexer,
  configMapping: ConfigMapping,
): ChainModule {
  const dataIndexers: ChainAmountIndexer[] = []
  const valueIndexers: ValueIndexer[] = []

  for (const chainConfig of config.chains) {
    const chain = chainConfig.chain
    if (!chainConfig.config) {
      logger.tag(chain).info(`Chain module disabled`)
      continue
    }

    const { amountService, valueService } = createPeripherals(
      peripherals,
      chainConfig,
      logger,
      chain,
      config,
    )

    const chainAmountEntries = config.amounts
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

    const blockTimestampIndexer = blockTimestampIndexers.get(chain)
    assert(
      blockTimestampIndexer,
      'blockTimestampIndexer should be defined for enabled chain',
    )

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

      const parents = [descendantPriceIndexer, chainAmountIndexer]
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
  }

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
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const circulatingSupplyService = new CirculatingSupplyService({
    coingeckoQueryService,
  })
  const valueService = new ValueService(peripherals.database)

  return {
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
