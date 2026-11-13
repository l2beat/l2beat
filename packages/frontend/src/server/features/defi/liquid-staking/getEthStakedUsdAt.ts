import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { toEth } from './computeLiquidStakingCharts'
import { getEthPricesAt } from './getEthPricesAt'

/** A day's stake stands for the two days after it starts, so a late indexer leaves no gap. */
const MAX_STAKE_AGE = 2 * UnixTime.DAY
const MOCK_ETH_STAKED = 34_000_000

/**
 * The USD value of the ETH staked network-wide at each timestamp: the stake
 * as the day started, at the ETH price TVS used then. Null when either is
 * missing.
 */
export async function getEthStakedUsdAt(
  timestamps: number[],
): Promise<(number | null)[]> {
  if (timestamps.length === 0) return []
  const [ethStaked, ethPrices] = await Promise.all([
    getEthStakedAt(timestamps),
    getEthPricesAt(timestamps),
  ])
  return timestamps.map((_, i) => {
    const stake = ethStaked[i]
    const price = ethPrices[i]
    return stake != null && price != null ? stake * price : null
  })
}

async function getEthStakedAt(
  timestamps: number[],
): Promise<(number | null)[]> {
  if (env.MOCK) return timestamps.map(() => MOCK_ETH_STAKED)
  const records = await getDb().ethereumStakingDaily.getInRange(
    UnixTime(Math.min(...timestamps) - MAX_STAKE_AGE),
    UnixTime(Math.max(...timestamps)),
  )
  return getLatestAtOrBefore(
    timestamps,
    records.map((record) => ({
      timestamp: record.timestamp,
      value: toEth(record.activeBalance),
    })),
    MAX_STAKE_AGE,
  )
}

/**
 * For each timestamp, the value of the latest point at or before it, if that
 * point is at most `maxAge` older. Both lists are oldest first.
 */
export function getLatestAtOrBefore(
  timestamps: number[],
  points: { timestamp: number; value: number }[],
  maxAge: number,
): (number | null)[] {
  let next = 0
  let latest: { timestamp: number; value: number } | undefined
  return timestamps.map((timestamp) => {
    while (
      next < points.length &&
      (points[next]?.timestamp ?? 0) <= timestamp
    ) {
      latest = points[next]
      next++
    }
    return latest && timestamp - latest.timestamp <= maxAge
      ? latest.value
      : null
  })
}
