import type { CoingeckoClient, CoinMarketChartRangeData } from '@l2beat/shared'
import {
  assert,
  type CoingeckoId,
  type EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import { MIN_TIMESTAMP_FOR_TVL } from '../../projects/ethereum/ethereum'
import type { GeneratedToken } from '../types'
import {
  findCreationBlock,
  findFirstBlockWithTotalSupply,
} from './findFirstBlock'
import type { ScriptLogger } from './ScriptLogger'

type Supply = GeneratedToken['supply']

export async function getTokenInfo(
  logger: ScriptLogger,
  provider: providers.JsonRpcProvider,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
  symbolFromConfig: string,
  coingeckoId: CoingeckoId,
  supply: Supply,
  deploymentTimestampOverride?: UnixTime,
) {
  const [
    name,
    symbol,
    decimals,
    iconUrl,
    deploymentTimestamp,
    coingeckoListingTimestamp,
  ] = await Promise.all([
    getName(provider, logger, address),
    getSymbol(provider, logger, address),
    getDecimals(provider, logger, address),
    getImageUrl(coingeckoClient, logger, coingeckoId),
    getDeploymentTimestamp(
      logger,
      provider,
      address,
      supply,
      deploymentTimestampOverride,
    ),
    getCoingeckoListingTimestamp(logger, coingeckoClient, coingeckoId, supply),
  ])

  logger.assert(
    symbol === symbolFromConfig,
    ` symbol mismatch  ${symbol} !== ${symbolFromConfig}`,
  )

  return {
    name,
    symbol,
    decimals,
    iconUrl,
    deploymentTimestamp,
    coingeckoListingTimestamp,
    coingeckoId,
  }
}

const ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, logger, bytes[] returnData)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]
const CODER = new utils.Interface(ABI)

async function getName(
  provider: providers.JsonRpcProvider,
  logger: ScriptLogger,
  address: EthereumAddress,
) {
  logger.fetching('name')

  const name = await provider.call({
    to: address.toString(),
    data: '0x06fdde03', // name()
  })

  logger.assert(name !== '0x', 'Could not find name for token')

  return CODER.decodeFunctionResult('name', name)[0] as string
}

async function getSymbol(
  provider: providers.JsonRpcProvider,
  logger: ScriptLogger,
  address: EthereumAddress,
) {
  logger.fetching('symbol')

  const symbol = await provider.call({
    to: address.toString(),
    data: '0x95d89b41', // symbol()
  })

  logger.assert(symbol !== '0x', 'Could not find symbol for token')

  return CODER.decodeFunctionResult('symbol', symbol)[0] as string
}

async function getDecimals(
  provider: providers.JsonRpcProvider,
  logger: ScriptLogger,
  address: EthereumAddress,
) {
  logger.fetching('decimals')

  const decimals = await provider.call({
    to: address.toString(),
    data: '0x313ce567', // decimals()
  })

  logger.assert(decimals !== '0x', 'Could not find decimals for token')

  return Number.parseInt(
    CODER.decodeFunctionResult('decimals', decimals)[0] as string,
    10,
  )
}

async function getImageUrl(
  coingeckoClient: CoingeckoClient,
  logger: ScriptLogger,
  coingeckoId: CoingeckoId,
): Promise<string> {
  logger.fetching('image url')

  switch (coingeckoId) {
    case 'polygon-ecosystem-token':
    case 'optimism':
      return `/images/custom-tokens/${coingeckoId}.png`
    default:
      return await coingeckoClient.getImageUrl(coingeckoId)
  }
}

async function getDeploymentTimestamp(
  logger: ScriptLogger,
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  supply: Supply,
  override?: UnixTime,
) {
  if (override) {
    return override
  }

  logger.fetching('sinceTimestamp (this will take a while)')

  const latestBlock = await provider.getBlockNumber()
  const creationBlock = await findCreationBlock(provider, address, latestBlock)
  const startBlock =
    supply === 'totalSupply'
      ? await findFirstBlockWithTotalSupply(
          provider,
          address,
          creationBlock,
          latestBlock,
        )
      : creationBlock
  logger.assert(
    startBlock !== undefined,
    'totalSupply() reverts at the latest block, provide manual override in tokens.jsonc',
  )
  if (startBlock !== creationBlock) {
    logger.notify(
      'totalSupply() first readable',
      `at block ${startBlock}, not at creation block ${creationBlock}`,
    )
  }

  const timestamp = UnixTime((await provider.getBlock(startBlock)).timestamp)
  assert(
    timestamp > MIN_TIMESTAMP_FOR_TVL,
    'Deployment timestamp looks odd, provide manual override in tokens.jsonc',
  )

  return timestamp
}

async function getCoingeckoListingTimestamp(
  logger: ScriptLogger,
  coingeckoClient: CoingeckoClient,
  coingeckoId: CoingeckoId,
  supply: Supply,
) {
  logger.fetching('coingeckoListingTimestamp')

  const history = await coingeckoClient.getCoinMarketChartRange(
    coingeckoId,
    'usd',
    MIN_TIMESTAMP_FOR_TVL,
    UnixTime.now(),
  )

  const timestamp = getFirstUsableCoingeckoTimestamp(history, supply)
  logger.assert(
    timestamp !== undefined,
    supply === 'circulatingSupply'
      ? `No market cap history found for token: ${coingeckoId.toString()}`
      : `No price history found for token: ${coingeckoId.toString()}`,
  )

  return timestamp
}

// CoinGecko can list a price days before a real market cap (-1 or 0 until
// then). A circulating supply is market cap / price, so it starts only once
// both are real.
export function getFirstUsableCoingeckoTimestamp(
  history: CoinMarketChartRangeData,
  supply: Supply,
): UnixTime | undefined {
  const firstUsable =
    supply === 'circulatingSupply'
      ? history.marketCaps.find(
          (marketCap, i) =>
            marketCap.value > 0 && (history.prices[i]?.value ?? 0) > 0,
        )
      : history.prices[0]

  return firstUsable
    ? UnixTime(Math.floor(firstUsable.date.getTime() / 1000))
    : undefined
}
