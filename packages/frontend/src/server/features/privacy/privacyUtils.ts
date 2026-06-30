import { TICKERS } from '@l2beat/config/build/projects/tornado-cash/tornado-cash'
import type { PrivacyProjectConfig } from './types'

interface TokenInfo {
  ticker: string
  decimals: number
  price: number | null
}

export interface PrivacyBucketInfo {
  decimals: number
  priceUsd: number | null
}

const NORMALIZED_TICKERS = new Map<string, TokenInfo>(
  Object.entries(TICKERS).map(([address, value]) => [
    address.toLowerCase(),
    {
      ticker: value.ticker,
      decimals: value.decimals,
      price:
        'price' in value &&
        (typeof value.price === 'number' || value.price === null)
          ? value.price
          : null,
    },
  ]),
)

const WETH_INFO = [...NORMALIZED_TICKERS.values()].find(
  (token) => token.ticker === 'WETH',
)

const NORMALIZED_TICKERS_BY_SYMBOL = new Map<string, TokenInfo>(
  [...NORMALIZED_TICKERS.values()].map((token) => [
    token.ticker.toLowerCase(),
    token,
  ]),
)

// Coingecko-style slugs for the demo tokens that exist in `TICKERS`. Used only
// as a last-resort fallback when neither address nor ticker resolve a row.
const SLUG_TO_TICKER: Record<string, string> = {
  ethereum: 'ETH',
  weth: 'WETH',
  'usd-coin': 'USDC',
  tether: 'USDT',
  dai: 'DAI',
  cdai: 'cDAI',
  'wrapped-bitcoin': 'WBTC',
  'wrapped-steth': 'wstETH',
  'wrapped-oeth': 'WOETH',
  'ethena-usde': 'USDe',
  usds: 'USDS',
  susds: 'sUSDS',
  usd1: 'USD1',
  'frax-share': 'frxUSD',
  fxusd: 'fxUSD',
  bold: 'BOLD',
  near: 'NEAR',
  rail: 'RAIL',
  instadapp: 'FLUID',
  fluid: 'FLUID',
}

function getEthTokenInfo(): TokenInfo {
  return { ticker: 'ETH', decimals: 18, price: WETH_INFO?.price ?? null }
}

export interface PrivacyTokenLookup {
  /** Ethereum token address (when present in the source row). */
  address?: string
  /** Token ticker symbol, e.g. parsed from a bucket id. */
  ticker?: string
  /** Coingecko-style slug from the CSV `token` column. */
  slug?: string
}

/**
 * Non-throwing variant of {@link getPrivacyTokenInfo}. Resolves token metadata
 * by address, then ticker, then coingecko slug, with an ETH special case for
 * each. Returns `undefined` when the token is unknown so callers can skip the
 * row instead of throwing.
 */
export function tryGetPrivacyTokenInfo(
  lookup: PrivacyTokenLookup,
): TokenInfo | undefined {
  const { address, ticker, slug } = lookup

  if (address && address.trim() !== '') {
    const byAddress = NORMALIZED_TICKERS.get(address.toLowerCase())
    if (byAddress) return byAddress
  }

  if (ticker && ticker.trim() !== '') {
    const normalized = ticker.toLowerCase()
    if (normalized === 'eth' || normalized === 'ethereum') {
      return getEthTokenInfo()
    }
    const byTicker = NORMALIZED_TICKERS_BY_SYMBOL.get(normalized)
    if (byTicker) return byTicker
  }

  if (slug && slug.trim() !== '') {
    const normalized = slug.toLowerCase()
    if (normalized === 'ethereum' || normalized === 'eth') {
      return getEthTokenInfo()
    }
    const mappedTicker = SLUG_TO_TICKER[normalized]
    if (mappedTicker) {
      const bySlug = NORMALIZED_TICKERS_BY_SYMBOL.get(
        mappedTicker.toLowerCase(),
      )
      if (bySlug) return bySlug
    }
  }

  return undefined
}

export function getPrivacyBucketKey(
  projectId: string,
  assetKey: string,
  bucketId: string,
): string {
  return `${projectId}::${assetKey}::${bucketId}`
}

export function buildPrivacyBucketInfoByKey(
  projects: PrivacyProjectConfig[],
): Map<string, PrivacyBucketInfo> {
  const bucketInfoByKey = new Map<string, PrivacyBucketInfo>()

  for (const project of projects) {
    const projectId = project.id.toString()

    for (const asset of project.privacyInfo.assets) {
      const tokenInfo = getPrivacyTokenInfo(
        asset.asset.address,
        asset.asset.symbol,
      )
      const assetKey = (
        asset.asset.address ??
        asset.asset.symbol ??
        tokenInfo.ticker
      ).toLowerCase()

      for (const bucket of asset.buckets) {
        bucketInfoByKey.set(
          getPrivacyBucketKey(projectId, assetKey, bucket.id),
          {
            decimals: tokenInfo.decimals,
            priceUsd: tokenInfo.price,
          },
        )
      }
    }
  }

  return bucketInfoByKey
}

export function getPrivacyTokenInfo(
  address: string | undefined,
  symbol: string | undefined,
): TokenInfo {
  if (address) {
    const tokenInfo = NORMALIZED_TICKERS.get(address.toLowerCase())
    if (tokenInfo) return tokenInfo
  }

  if (symbol === 'ETH' && WETH_INFO) {
    return { ticker: 'ETH', decimals: 18, price: WETH_INFO.price }
  }

  throw new Error(
    `Missing ticker metadata for privacy asset ${symbol ?? address ?? 'unknown'}`,
  )
}

export function amountToUsd(
  amount: bigint,
  decimals: number,
  priceUsd: number | null,
): number {
  if (priceUsd === null) return 0
  return bigintToNumber(amount, decimals) * priceUsd
}

export function bigintToNumber(value: bigint, decimals: number): number {
  if (decimals === 0) return Number(value)
  const divisor = 10n ** BigInt(decimals)
  const integer = value / divisor
  const fraction = value % divisor
  if (fraction === 0n) return Number(integer)

  const fractionDigits = fraction
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '')
    .slice(0, 8)

  return Number(
    `${integer.toString()}.${fractionDigits === '' ? '0' : fractionDigits}`,
  )
}
