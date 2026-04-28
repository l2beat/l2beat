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
