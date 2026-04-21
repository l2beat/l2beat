import { TICKERS } from '@l2beat/config/build/projects/tornado-cash/tornado-cash'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ChartRange } from '~/utils/range/range'
import {
  getAllPrivacyHistoryCursors,
  getAllPrivacyHistoryRows,
} from './db/PrivacyHistoryRepo'
import { getPrivacyProjects } from './getPrivacyProjects'

interface TokenInfo {
  ticker: string
  decimals: number
  price: number | null
}

export const PrivacyProjectChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
})

export type PrivacyProjectChartParams = v.infer<
  typeof PrivacyProjectChartParams
>

export type PrivacyProjectChartPoint = [
  timestamp: number,
  depositsCount: number,
  withdrawalsCount: number,
  depositsValueUsd: number,
  withdrawalsValueUsd: number,
]

export interface PrivacyProjectChartResponse {
  chart: PrivacyProjectChartPoint[]
  syncedUntil: number | undefined
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

export async function getPrivacyProjectChart(
  params: PrivacyProjectChartParams,
): Promise<PrivacyProjectChartResponse> {
  const projects = await getPrivacyProjects()
  const project = projects.find((project) => project.id === params.projectId)

  if (!project) {
    return { chart: [], syncedUntil: undefined }
  }

  const bucketInfoByKey = new Map<
    string,
    { decimals: number; priceUsd: number | null }
  >()

  for (const asset of project.privacyInfo.assets) {
    const tokenInfo = getTokenInfo(asset.asset.address, asset.asset.symbol)
    const assetKey = (
      asset.asset.address ??
      asset.asset.symbol ??
      tokenInfo.ticker
    ).toLowerCase()

    for (const bucket of asset.buckets) {
      bucketInfoByKey.set(`${assetKey}::${bucket.id}`, {
        decimals: tokenInfo.decimals,
        priceUsd: tokenInfo.price,
      })
    }
  }

  const historyRows = getAllPrivacyHistoryRows().filter(
    (row) => row.projectId === params.projectId && row.timestamp > 0,
  )
  const historyCursors = getAllPrivacyHistoryCursors().filter((cursor) =>
    cursor.key.startsWith(`${params.projectId}::`),
  )
  const syncedUntil =
    historyCursors.length > 0
      ? UnixTime.toStartOf(
          Math.min(...historyCursors.map((cursor) => cursor.syncedAt)),
          'day',
        )
      : undefined

  if (historyRows.length === 0) {
    if (params.range[0] === null) {
      return { chart: [], syncedUntil }
    }

    return {
      chart: generateTimestamps(normalizeRange(params.range), 'daily').map(
        (timestamp) => [timestamp, 0, 0, 0, 0],
      ),
      syncedUntil,
    }
  }

  const minTimestamp = Math.min(...historyRows.map((row) => row.timestamp))
  const range = normalizeRange(params.range, minTimestamp)

  const grouped = new Map<
    number,
    {
      depositsCount: number
      withdrawalsCount: number
      depositsValueUsd: number
      withdrawalsValueUsd: number
    }
  >()

  for (const row of historyRows) {
    if (row.timestamp < range[0] || row.timestamp > range[1]) continue

    const bucketInfo = bucketInfoByKey.get(`${row.assetKey}::${row.bucketId}`)
    if (!bucketInfo) continue

    const entry = grouped.get(row.timestamp) ?? {
      depositsCount: 0,
      withdrawalsCount: 0,
      depositsValueUsd: 0,
      withdrawalsValueUsd: 0,
    }

    entry.depositsCount += row.depositCount
    entry.withdrawalsCount += row.withdrawalCount
    entry.depositsValueUsd += amountToUsd(
      BigInt(row.depositAmount),
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )
    entry.withdrawalsValueUsd += amountToUsd(
      BigInt(row.withdrawalAmount),
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )

    grouped.set(row.timestamp, entry)
  }

  return {
    chart: generateTimestamps(range, 'daily').map((timestamp) => {
      const entry = grouped.get(timestamp)
      return [
        timestamp,
        entry?.depositsCount ?? 0,
        entry?.withdrawalsCount ?? 0,
        entry?.depositsValueUsd ?? 0,
        entry?.withdrawalsValueUsd ?? 0,
      ]
    }),
    syncedUntil: syncedUntil ?? range[1],
  }
}

function normalizeRange(
  range: PrivacyProjectChartParams['range'],
  minTimestamp?: number,
): [UnixTime, UnixTime] {
  const from =
    range[0] === null
      ? UnixTime.toStartOf(minTimestamp ?? range[1], 'day')
      : UnixTime.toStartOf(range[0], 'day')
  const to = UnixTime.toStartOf(range[1], 'day')

  return [UnixTime(from), UnixTime(to)]
}

function getTokenInfo(
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

function amountToUsd(
  amount: bigint,
  decimals: number,
  priceUsd: number | null,
): number {
  if (priceUsd === null) return 0
  return bigintToNumber(amount, decimals) * priceUsd
}

function bigintToNumber(value: bigint, decimals: number): number {
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
