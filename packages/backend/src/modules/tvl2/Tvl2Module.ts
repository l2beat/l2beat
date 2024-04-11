import { assert, Logger } from '@l2beat/backend-tools'
import { MulticallContractConfig, tokenList } from '@l2beat/config'
import {
  BlockscoutClient,
  CoingeckoClient,
  CoingeckoQueryService,
  EtherscanClient,
} from '@l2beat/shared'
import {
  Bytes,
  EscrowEntry,
  EthereumAddress,
  TotalSupplyEntry,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import { Config } from '../../config'
import { Tvl2Config } from '../../config/Config'
import {
  ERC20MulticallCodec,
  NativeAssetMulticallCodec,
} from '../../peripherals/multicall/codecs'
import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import { toMulticallConfigEntry } from '../../peripherals/multicall/MulticallConfig'
import { MulticallRequest } from '../../peripherals/multicall/types'
import { Peripherals } from '../../peripherals/Peripherals'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../tools/Clock'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../ApplicationModule'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { ETHEREUM_BALANCE_ENCODING } from '../tvl/balances/BalanceProvider'
import { AmountService } from './AmountService'
import { createTvl2StatusRouter } from './api/Tvl2StatusRouter'
import {
  BlockTimestampIndexer,
  BlockTimestampProvider,
} from './BlockTimestampIndexer'
import { ChainIndexer } from './ChainIndexer'
import { PriceIndexer } from './PriceIndexer'
import { AmountRepository } from './repositories/AmountRepository'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
import { PriceRepository } from './repositories/PriceRepository'
import { SyncOptimizer } from './SyncOptimizer'
import { Configuration } from '../../tools/uif/multi/types'
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

  assert(config.tvl2.ethereum.config)

  const rpcClient = peripherals.getClient(RpcClient, {
    url: config.tvl2.ethereum.config.providerUrl,
    callsPerMinute: config.tvl2.ethereum.config.providerCallsPerMinute,
  })

  const amountService = new AmountService({
    rpcClient,
    multicallClient: new MulticallClient(
      rpcClient,
      multicallConfig.map(toMulticallConfigEntry),
    ),
    erc20Codec,
    nativeAssetCodec,
    logger: logger.tag(config.tvl2.ethereum.chain),
  })

  const ethereumBlockIndexer = blockTimestampIndexers.find(
    (indexer) => indexer.indexerId === '',
  )
  assert(ethereumBlockIndexer)

  const escrowsAndTotalSupplies = config.tvl2.amounts.filter(
    (a) =>
      (a.type === 'escrow' || a.type === 'totalSupply') &&
      a.chain === 'ethereum',
  ) as (EscrowEntry | TotalSupplyEntry)[]

  const configurations: Configuration<EscrowEntry | TotalSupplyEntry>[] =
    escrowsAndTotalSupplies.map((a) => ({
      id: createAmountId(a),
      properties: a,
      minHeight: a.sinceTimestamp,
      maxHeight: a.untilTimestamp,
    }))

  const chainIndexer = new ChainIndexer({
    amountService,
    amountRepository: peripherals.getRepository(AmountRepository),
    parents: [ethereumBlockIndexer],
    id: 'chain_indexer_ethereum',
    configurations,
    encode: () => 'TODO',
    decode: () => 'TODO',
    syncOptimizer,
    logger: logger.tag('ethereum'),
    indexerService,
  })

  const indexers = [...blockTimestampIndexers, ...priceIndexers]

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

// function getChainIndexers(
//   config: Config,
//   peripherals: Peripherals,
//   logger: Logger,
//   syncOptimizer: SyncOptimizer,
//   indexerService: IndexerService,
// ) {
//   return config.tvl2.chains
//     .filter((c) => c.config !== undefined)
//     .map((chain) => {
//       assert(chain.config !== undefined, 'Chain config is required')

//       const amountService = new AmountService({
//         rpcClient: peripherals.getClient(RpcClient, {
//           url: chain.config.rpcUrl,
//         }),
//         multicallClient: peripherals.getClient(MulticallClient, {
//           url: chain.config.multicallUrl,
//         }),
//         erc20Codec: peripherals.getCodec(ERC20MulticallCodec),
//         logger: logger.tag(chain.chain),
//       })

//       return new ChainIndexer({
//         amountService,
//         amountRepository: peripherals.getRepository(AmountRepository),
//         parents: [], //TODO
//         id: 'TODO',
//         configurations: [], //TODO
//         encode: () => 'TODO',
//         decode: () => 'TODO',
//         syncOptimizer,
//         logger: logger.tag(chain.chain),
//         indexerService,
//       })
//     })
// }

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

const multicallConfig: MulticallContractConfig[] = [
  {
    address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
    batchSize: 150,
    sinceBlock: 14353601,
    version: '3',
  },
  {
    sinceBlock: 12336033,
    batchSize: 150,
    address: EthereumAddress('0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696'),
    version: '2',
  },
  {
    sinceBlock: 7929876,
    batchSize: 150,
    address: EthereumAddress('0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441'),
    version: '1',
  },
]

const nativeAssetCodec: NativeAssetMulticallCodec = {
  sinceBlock: ETHEREUM_BALANCE_ENCODING.sinceBlock,
  balance: {
    encode: encodeGetEthBalance,
    decode: decodeGetEthBalance,
  },
}

const erc20Codec: ERC20MulticallCodec = {
  balance: {
    encode: encodeErc20BalanceQuery,
    decode: decodeErc20BalanceQuery,
  },
  totalSupply: {
    encode: encodeErc20TotalSupplyQuery,
    decode: decodeErc20TotalSupplyQuery,
  },
}

const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

const multicallInterface = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
])

function encodeGetEthBalance(address: EthereumAddress): MulticallRequest {
  return {
    address: ETHEREUM_BALANCE_ENCODING.address,
    data: Bytes.fromHex(
      multicallInterface.encodeFunctionData('getEthBalance', [
        address.toString(),
      ]),
    ),
  }
}

function decodeGetEthBalance(response: Bytes) {
  return (
    multicallInterface.decodeFunctionResult(
      'getEthBalance',
      response.toString(),
    )[0] as BigNumber
  ).toBigInt()
}

function encodeErc20BalanceQuery(
  holder: EthereumAddress,
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(
      erc20Interface.encodeFunctionData('balanceOf', [holder.toString()]),
    ),
  }
}

function decodeErc20BalanceQuery(response: Bytes): bigint {
  const [value] = erc20Interface.decodeFunctionResult(
    'balanceOf',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}

export function encodeErc20TotalSupplyQuery(
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
  }
}

export function decodeErc20TotalSupplyQuery(response: Bytes): bigint {
  const [value] = erc20Interface.decodeFunctionResult(
    'totalSupply',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}
