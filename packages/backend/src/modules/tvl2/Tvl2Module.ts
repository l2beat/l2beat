import { assert, Logger } from '@l2beat/backend-tools'
import { tokenList } from '@l2beat/config'
import {
  BlockscoutClient,
  CoingeckoClient,
  CoingeckoQueryService,
  EtherscanClient,
} from '@l2beat/shared'
import {
  EscrowEntry,
  EthereumAddress,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Tvl2Config } from '../../config/Config'
import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import { Peripherals } from '../../peripherals/Peripherals'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../tools/Clock'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { Configuration } from '../../tools/uif/multi/types'
import { ApplicationModule } from '../ApplicationModule'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { AmountService } from './AmountService'
import { createTvl2StatusRouter } from './api/Tvl2StatusRouter'
import {
  BlockTimestampIndexer,
  BlockTimestampProvider,
} from './BlockTimestampIndexer'
import { ChainAmountIndexer } from './ChainAmountIndexer'
import { PriceIndexer } from './PriceIndexer'
import { AmountRepository } from './repositories/AmountRepository'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
import { PriceRepository } from './repositories/PriceRepository'
import { SyncOptimizer } from './SyncOptimizer'
import { createAmountId } from './utils/createAmountId'

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

  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.tvl2.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const syncOptimizer = new SyncOptimizer(clock, {
    removeHourlyAfterDays: 10,
    removeSixHourlyAfterDays: 93,
  })

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

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceIndexers = getPriceIndexers(
    config.tvl2,
    logger,
    hourlyIndexer,
    coingeckoQueryService,
    peripherals,
    syncOptimizer,
  )

  const blockTimestampIndexers = getBlockTimestampIndexers(
    config.tvl2,
    peripherals,
    logger,
    hourlyIndexer,
    syncOptimizer,
  )

  const chainAmountIndexers = getChainAmountIndexers(
    config.tvl2,
    peripherals,
    logger,
    syncOptimizer,
    indexerService,
    blockTimestampIndexers,
  )

  const indexers = [
    ...blockTimestampIndexers,
    ...priceIndexers,
    ...chainAmountIndexers,
  ]

  const statusRouter = createTvl2StatusRouter(config.tvl2, indexers, clock)

  const start = async () => {
    logger = logger.for('Tvl2Module')

    await hourlyIndexer.start()

    for (const indexer of indexers) {
      await indexer.start()
    }

    logger.info('Started')
  }

  return {
    routers: [statusRouter],
    start,
  }
}

function getPriceIndexers(
  config: Tvl2Config,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  coingeckoQueryService: CoingeckoQueryService,
  peripherals: Peripherals,
  syncOptimizer: SyncOptimizer,
): PriceIndexer[] {
  return config.prices.map(
    (price) =>
      new PriceIndexer(
        // TODO: write it correctly
        logger.tag(
          `${price.chain}:${
            tokenList.find((t) => t.address === price.address)?.symbol ??
            'native'
          }`,
        ),
        hourlyIndexer,
        coingeckoQueryService,
        peripherals.getRepository(IndexerStateRepository),
        peripherals.getRepository(PriceRepository),
        price,
        syncOptimizer,
      ),
  )
}

function getBlockTimestampIndexers(
  config: Tvl2Config,
  peripherals: Peripherals,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
): BlockTimestampIndexer[] {
  return config.chains
    .filter((c) => c.config !== undefined)
    .map((chain) => {
      assert(chain.config !== undefined, 'Chain config is required')

      const provider: BlockTimestampProvider =
        chain.config.blockNumberProviderConfig.type === 'etherscan'
          ? peripherals.getClient(EtherscanClient, {
              apiKey: chain.config.blockNumberProviderConfig.etherscanApiKey,
              url: chain.config.blockNumberProviderConfig.etherscanApiUrl,
              minTimestamp: chain.config.minBlockTimestamp,
              chainId: chain.config.chainId,
            })
          : peripherals.getClient(BlockscoutClient, {
              url: chain.config.blockNumberProviderConfig.blockscoutApiUrl,
              minTimestamp: chain.config.minBlockTimestamp,
              chainId: chain.config.chainId,
            })

      return new BlockTimestampIndexer(
        logger.tag(`${chain.chain}`),
        hourlyIndexer,
        provider,
        peripherals.getRepository(IndexerStateRepository),
        peripherals.getRepository(BlockTimestampRepository),
        chain.chain,
        chain.config.minBlockTimestamp,
        syncOptimizer,
      )
    })
}

function getChainAmountIndexers(
  config: Tvl2Config,
  peripherals: Peripherals,
  logger: Logger,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  blockTimestampIndexers: BlockTimestampIndexer[],
) {
  return config.chains
    .filter((c) => c.config !== undefined)
    .map((chain) => {
      assert(chain.config !== undefined, 'Chain config is required')

      const rpcClient = peripherals.getClient(RpcClient, {
        url: chain.config.providerUrl,
        callsPerMinute: chain.config.providerCallsPerMinute,
      })
      const amountService = new AmountService({
        rpcClient: rpcClient,
        multicallClient: new MulticallClient(rpcClient, chain.config.multicall),
        logger: logger.tag(chain.chain),
      })

      const blockTimestampIndexer = blockTimestampIndexers.find(
        (indexer) =>
          indexer.indexerId === `block_timestamp_indexer_${chain.chain}`,
      )
      assert(blockTimestampIndexer)

      const escrowsAndTotalSupplies = config.amounts.filter(
        (a) =>
          (a.type === 'escrow' || a.type === 'totalSupply') &&
          a.chain === chain.chain,
      ) as (EscrowEntry | TotalSupplyEntry)[]

      const chainMinTimestamp = chain.config.minBlockTimestamp

      const configurations: Configuration<EscrowEntry | TotalSupplyEntry>[] =
        escrowsAndTotalSupplies.map((a) => ({
          id: createAmountId(a),
          properties: a,
          minHeight: a.sinceTimestamp.lt(chainMinTimestamp)
            ? chainMinTimestamp.toNumber()
            : a.sinceTimestamp.toNumber(),
          maxHeight: a.untilTimestamp?.toNumber() ?? null,
        }))

      return new ChainAmountIndexer({
        amountService,
        amountRepository: peripherals.getRepository(AmountRepository),
        blockTimestampsRepository: peripherals.getRepository(
          BlockTimestampRepository,
        ),
        parents: [blockTimestampIndexer],
        id: `chain_amount_indexer_${chain.chain}`,
        configurations,
        encode,
        decode,
        syncOptimizer,
        logger: logger.tag(chain.chain),
        indexerService,
        chain: chain.chain,
      })
    })
}

function encode(value: EscrowEntry | TotalSupplyEntry): string {
  switch (value.type) {
    case 'escrow':
      return JSON.stringify({
        ...value,
        address: value.address.toString(),
        escrowAddress: value.escrowAddress.toString(),
        chain: value.chain,
        project: value.project.toString(),
        source: value.source,
        sinceTimestamp: value.sinceTimestamp.toNumber(),
        ...({ untilTimestamp: value.untilTimestamp?.toNumber() } ?? {}),
        includeInTotal: value.includeInTotal,
      })
    case 'totalSupply':
      return JSON.stringify({
        ...value,
        address: value.address.toString(),
        chain: value.chain,
        project: value.project.toString(),
        source: value.source,
        sinceTimestamp: value.sinceTimestamp.toNumber(),
        ...({ untilTimestamp: value.untilTimestamp?.toNumber() } ?? {}),
        includeInTotal: value.includeInTotal,
      })
  }
}

function decode(value: string): EscrowEntry | TotalSupplyEntry {
  const obj = JSON.parse(value) as {
    type: string
    address: string
    escrowAddress: string | undefined
    chain: string
    project: string
    source: string
    sinceTimestamp: number
    untilTimestamp?: number
    includeInTotal: boolean
  }

  switch (obj.type) {
    case 'escrow':
      assert(obj.escrowAddress !== undefined, 'escrowAddress is required')
      return {
        address:
          obj.address === 'native' ? 'native' : EthereumAddress(obj.address),
        escrowAddress: EthereumAddress(obj.escrowAddress),
        chain: obj.chain,
        project: ProjectId(obj.project),
        source: obj.source,
        sinceTimestamp: new UnixTime(obj.sinceTimestamp),
        ...({
          untilTimestamp:
            obj.untilTimestamp && new UnixTime(obj.untilTimestamp),
        } ?? {}),
        includeInTotal: obj.includeInTotal,
      } as EscrowEntry
    case 'totalSupply':
      return {
        address:
          obj.address === 'native' ? 'native' : EthereumAddress(obj.address),
        chain: obj.chain,
        project: ProjectId(obj.project),
        source: obj.source,
        sinceTimestamp: new UnixTime(obj.sinceTimestamp),
        ...({
          untilTimestamp:
            obj.untilTimestamp && new UnixTime(obj.untilTimestamp),
        } ?? {}),
        includeInTotal: obj.includeInTotal,
      } as TotalSupplyEntry
    default:
      throw new Error('Unknown type')
  }
}
