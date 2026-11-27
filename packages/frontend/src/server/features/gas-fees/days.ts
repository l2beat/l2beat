import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'

/** The start of a UTC day, from "2026-04-22" */
export function utcDay(date: string): UnixTime {
  return UnixTime.fromDate(new Date(`${date}T00:00:00Z`))
}

/** The first day stored: the fee rules were checked from it on */
export const GAS_FEES_FIRST_DAY = utcDay('2025-11-01')

/** The 365 days up to yesterday */
export function pastYear(now = UnixTime.now()): [UnixTime, UnixTime] {
  const to = UnixTime(UnixTime.toStartOf(now, 'day') - UnixTime.DAY)
  return [UnixTime(to - 364 * UnixTime.DAY), to]
}

/** The whole days of a range, clamped to the days stored */
export function toDayRange(range: ChartRange): [UnixTime, UnixTime] {
  const from = UnixTime.toStartOf(range[0] ?? GAS_FEES_FIRST_DAY, 'day')
  return [
    UnixTime(Math.max(from, GAS_FEES_FIRST_DAY)),
    UnixTime.toStartOf(range[1], 'day'),
  ]
}

export function eachDay(from: UnixTime, to: UnixTime): UnixTime[] {
  const days: UnixTime[] = []
  for (let day = from; day <= to; day = UnixTime(day + UnixTime.DAY)) {
    days.push(day)
  }
  return days
}

/** The days some figures were computed from */
export interface DayPeriod {
  /** The first day with data */
  from: number
  /** The last day with data */
  to: number
  days: number
  /** Days between `from` and `to` without data */
  missingDays: number
}

/** undefined without a single day */
export function toDayPeriod(days: number[]): DayPeriod | undefined {
  const from = days[0]
  const to = days.at(-1)
  if (from === undefined || to === undefined) return undefined
  const span = (to - from) / UnixTime.DAY + 1
  return { from, to, days: days.length, missingDays: span - days.length }
}
