import type {
  CoingeckoClient,
  CoinMarketChartRangeData,
  EthRpcClient,
} from '@l2beat/shared'
import {
  assert,
  type CoingeckoId,
  type EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { MIN_TIMESTAMP_FOR_TVL } from '../../projects/ethereum/ethereum'
import type { GeneratedToken } from '../types'
import {
  findCreationBlock,
  findFirstBlockWithTotalSupply,
} from './findStartBlock'
import type { ScriptLogger } from './ScriptLogger'

interface TokenToFetch {
  address: EthereumAddress
  symbol: string
  coingeckoId: CoingeckoId
  supply: GeneratedToken['supply']
  deploymentTimestampOverride?: UnixTime
}

export async function getTokenInfo(
  logger: ScriptLogger,
  rpc: EthRpcClient,
  coingeckoClient: CoingeckoClient,
  token: TokenToFetch,
) {
  // The TVS indexer stalls wherever the amount is unreadable, so start once the
  // supply formula has data: totalSupply() on-chain, or a real market cap for a
  // circulating supply (market cap / price).
  const [
    name,
    symbol,
    decimals,
    iconUrl,
    deploymentTimestamp,
    coingeckoListingTimestamp,
  ] = await Promise.all([
    callView(rpc, logger, token.address, 'name'),
    callView(rpc, logger, token.address, 'symbol'),
    callView(rpc, logger, token.address, 'decimals'),
    getImageUrl(coingeckoClient, logger, token.coingeckoId),
    token.deploymentTimestampOverride ??
      getDeploymentTimestamp(logger, rpc, token.address, {
        requireTotalSupply: token.supply === 'totalSupply',
      }),
    getCoingeckoListingTimestamp(logger, coingeckoClient, token.coingeckoId, {
      requireMarketCap: token.supply === 'circulatingSupply',
    }),
  ])

  logger.assert(
    symbol === token.symbol,
    ` symbol mismatch  ${symbol} !== ${token.symbol}`,
  )

  return {
    name: String(name),
    symbol: String(symbol),
    decimals: Number(decimals),
    iconUrl,
    deploymentTimestamp,
    coingeckoListingTimestamp,
    coingeckoId: token.coingeckoId,
  }
}

const CODER = new utils.Interface([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
])

async function callView(
  rpc: EthRpcClient,
  logger: ScriptLogger,
  address: EthereumAddress,
  method: 'name' | 'symbol' | 'decimals',
): Promise<unknown> {
  logger.fetching(method)

  const result = await rpc.call(
    { to: address, input: CODER.getSighash(method) },
    'latest',
  )

  logger.assert(
    !result.reverted && result.data !== '0x',
    `Could not find ${method} for token`,
  )

  return CODER.decodeFunctionResult(method, result.data)[0]
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
  rpc: EthRpcClient,
  address: EthereumAddress,
  { requireTotalSupply }: { requireTotalSupply: boolean },
) {
  logger.fetching('sinceTimestamp (this will take a while)')

  const latestBlock = Number(await rpc.getBlockNumber())
  const creationBlock = await findCreationBlock(rpc, address, latestBlock)
  const startBlock = requireTotalSupply
    ? await findFirstBlockWithTotalSupply(
        rpc,
        address,
        creationBlock,
        latestBlock,
      )
    : creationBlock
  logger.assert(
    startBlock !== undefined,
    'totalSupply() is unreadable at the latest block, provide manual override in tokens.jsonc',
  )
  if (startBlock !== creationBlock) {
    logger.notify(
      'totalSupply() first readable',
      `at block ${startBlock}, not at creation block ${creationBlock}`,
    )
  }

  const block = await rpc.getBlockByNumber(BigInt(startBlock), false)
  assert(block, 'Start block not found')
  const timestamp = UnixTime(Number(block.timestamp))
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
  { requireMarketCap }: { requireMarketCap: boolean },
) {
  logger.fetching('coingeckoListingTimestamp')

  const history = await coingeckoClient.getCoinMarketChartRange(
    coingeckoId,
    'usd',
    MIN_TIMESTAMP_FOR_TVL,
    UnixTime.now(),
  )

  const timestamp = requireMarketCap
    ? getFirstMarketCapTimestamp(history)
    : getFirstPriceTimestamp(history)
  logger.assert(
    timestamp !== undefined,
    `No usable price history found for token: ${coingeckoId.toString()}`,
  )

  return timestamp
}

function getFirstPriceTimestamp(
  history: CoinMarketChartRangeData,
): UnixTime | undefined {
  const first = history.prices.at(0)
  return first && UnixTime.fromDate(first.date)
}

// CoinGecko can list a price days before a real market cap (-1 or 0 until
// then), and a circulating supply is market cap / price, so both must be real.
export function getFirstMarketCapTimestamp(
  history: CoinMarketChartRangeData,
): UnixTime | undefined {
  const priceAt = new Map(
    history.prices.map((price) => [price.date.getTime(), price.value]),
  )
  const first = history.marketCaps.find(
    (marketCap) =>
      marketCap.value > 0 && (priceAt.get(marketCap.date.getTime()) ?? 0) > 0,
  )
  return first && UnixTime.fromDate(first.date)
}
