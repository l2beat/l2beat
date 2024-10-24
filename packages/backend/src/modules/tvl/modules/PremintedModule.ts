import { Logger } from '@l2beat/backend-tools'
import { ConfigMapping } from '@l2beat/config'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient2,
  RetryHandler,
} from '@l2beat/shared'
import { assert, PremintedEntry, ProjectId } from '@l2beat/shared-pure'
import { ChainTvlConfig, TvlConfig } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { BlockTimestampIndexer } from '../indexers/BlockTimestampIndexer'
import { DescendantIndexer } from '../indexers/DescendantIndexer'
import { PremintedIndexer } from '../indexers/PremintedIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { AmountService } from '../services/AmountService'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

interface PremintedModule {
  start: () => Promise<void> | void
}

export function initPremintedModule(
  config: TvlConfig,
  logger: Logger,
  peripherals: Peripherals,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  configMapping: ConfigMapping,
  descendantPriceIndexer: DescendantIndexer,
  blockTimestampIndexers?: Map<string, BlockTimestampIndexer>,
): PremintedModule | undefined {
  const dataIndexers: PremintedIndexer[] = []
  const valueIndexers: ValueIndexer[] = []

  for (const chainConfig of config.chains) {
    const chain = chainConfig.chain
    if (!chainConfig.config) {
      continue
    }

    const premintedTokens = config.amounts
      .filter((a) => a.chain === chain)
      .filter((a): a is PremintedEntry => a.type === 'preminted')

    if (premintedTokens.length === 0) {
      continue
    }

    const { amountService, valueService, circulatingSupplyService } =
      createPeripherals(peripherals, chainConfig, logger, chain, config)

    const blockTimestampIndexer =
      blockTimestampIndexers && blockTimestampIndexers.get(chain)
    assert(
      blockTimestampIndexer,
      'blockTimestampIndexer should be defined for enabled chain',
    )

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
        parents: [descendantPriceIndexer, indexer],
        indexerService,
        logger,
        minHeight: preminted.sinceTimestamp.toNumber(),
        maxHeight: preminted.untilTimestamp?.toNumber(),
        maxTimestampsToProcessAtOnce: config.maxTimestampsToAggregateAtOnce,
      })

      valueIndexers.push(valueIndexer)
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

  const coingeckoClient = new CoingeckoClient(
    new HttpClient2(),
    config.coingeckoApiKey,
    RetryHandler.RELIABLE_API(logger),
  )
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
