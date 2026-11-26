import type { GasFeesDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import type { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS, type GasFeesChainId } from './chains'
import { getMockGasFeesRows } from './mock/getMockGasFeesRows'
import { toGasFeesRecord } from './toGasFeesRecord'
import type { GasFeesRecord } from './types'

/**
 * Per chain, oldest first. A day without a record is missing, not zero: the
 * backend stores a chain's day only once Dune has all of it.
 */
export type GasFeesRecords = Map<GasFeesChainId, GasFeesRecord[]>

const cache = new FrontendInMemoryCache('getGasFeesRecords')

/** Every stored day: a few thousand rows a year, which every range and metric is cut from */
export function getGasFeesRecords(): Promise<GasFeesRecords> {
  if (env.MOCK) return Promise.resolve(toRecords(getMockGasFeesRows()))
  return cache.get(
    { key: ['gas-fees', 'daily'], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
    async () =>
      toRecords(
        await getDb().gasFeesDaily.getInRange(UnixTime(0), UnixTime.now()),
      ),
  )
}

function toRecords(rows: GasFeesDailyRecord[]): GasFeesRecords {
  const records: GasFeesRecords = new Map()
  for (const chain of GAS_FEES_CHAINS) {
    records.set(
      chain.id,
      rows
        .filter((row) => row.chain === chain.id)
        .map((row) => toGasFeesRecord(row, chain)),
    )
  }
  return records
}

/** The first and last day any chain has, undefined when nothing is stored */
export function getStoredDays(
  records: GasFeesRecords,
): { first: number; last: number } | undefined {
  let first = Number.POSITIVE_INFINITY
  let last = Number.NEGATIVE_INFINITY
  for (const chain of records.values()) {
    first = Math.min(first, chain[0]?.timestamp ?? first)
    last = Math.max(last, chain.at(-1)?.timestamp ?? last)
  }
  return Number.isFinite(first) ? { first, last } : undefined
}

/** Every day of the range that could be stored, so a day no chain has still counts */
export function getRangeDays(records: GasFeesRecords, [from, to]: ChartRange) {
  const stored = getStoredDays(records)
  if (!stored) return []
  const first = Math.max(
    stored.first,
    from === null ? stored.first : UnixTime.toStartOf(from, 'day'),
  )
  const days: number[] = []
  for (let day = first; day <= stored.last && day < to; day += UnixTime.DAY) {
    days.push(day)
  }
  return days
}
