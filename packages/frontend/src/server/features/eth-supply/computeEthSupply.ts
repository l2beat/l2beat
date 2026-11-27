import type { EthereumStakingDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { toEth } from '~/server/features/defi/liquid-staking/computeLiquidStakingCharts'
import type { EthSupplyDay } from './types'

const DAY = UnixTime.DAY

/**
 * Net consensus-layer issuance of each day whose next day has a record too:
 * the change in what validators hold, less the ETH that moved in or out.
 */
export function getDailyIssuance(
  records: EthereumStakingDailyRecord[],
): Map<number, number> {
  const byDay = new Map(records.map((r) => [r.timestamp, r]))
  // A credited deposit sits in a balance or, from Electra, the pending queue.
  const held = (r: EthereumStakingDailyRecord) =>
    r.totalBalance + (r.pendingDeposits ?? 0n)
  const issuance = new Map<number, number>()
  for (const start of records) {
    const end = byDay.get(start.timestamp + DAY)
    if (!end) continue
    issuance.set(
      start.timestamp,
      toEth(held(end) - held(start) + start.withdrawals - start.deposits),
    )
  }
  return issuance
}

/**
 * The unbroken run of days around the anchor that have both an issuance and
 * a burn, with the supply walked out from the anchor's. A day missing either
 * ends the run, since the supply past it is unknown.
 */
export function buildSupplyDays({
  issuance,
  burn,
  ethPrices,
  anchor,
}: {
  issuance: Map<number, number>
  burn: Map<number, number>
  ethPrices: Map<number, number>
  anchor: { timestamp: number; totalSupply: number }
}): EthSupplyDay[] {
  const net = (day: number) => {
    const issued = issuance.get(day)
    const burned = burn.get(day)
    return issued === undefined || burned === undefined
      ? undefined
      : issued - burned
  }
  if (net(anchor.timestamp) === undefined) {
    throw new Error('Supply anchor not covered', {
      cause: { anchor: anchor.timestamp },
    })
  }

  let first = anchor.timestamp
  while (net(first - DAY) !== undefined) first -= DAY
  let last = anchor.timestamp
  while (net(last + DAY) !== undefined) last += DAY

  let totalSupply = anchor.totalSupply
  for (let day = anchor.timestamp; day > first; day -= DAY) {
    totalSupply -= net(day) ?? 0
  }
  const days: EthSupplyDay[] = []
  for (let day = first; day <= last; day += DAY) {
    if (day > first) totalSupply += net(day) ?? 0
    days.push({
      timestamp: day,
      totalSupply: round(totalSupply, 2),
      issuance: round(issuance.get(day) ?? 0, 4),
      burn: round(burn.get(day) ?? 0, 4),
      ethPriceUsd: ethPrices.get(day) ?? null,
    })
  }
  return days
}

function round(value: number, decimals: number) {
  const scale = 10 ** decimals
  return Math.round(value * scale) / scale
}
