import { assert, UnixTime } from '@l2beat/shared-pure'
import { EM_DASH } from '~/consts/characters'

export const MONTHS: Record<string, { shortName: string }> = {
  '01': { shortName: 'Jan' },
  '02': { shortName: 'Feb' },
  '03': { shortName: 'Mar' },
  '04': { shortName: 'Apr' },
  '05': { shortName: 'May' },
  '06': { shortName: 'Jun' },
  '07': { shortName: 'Jul' },
  '08': { shortName: 'Aug' },
  '09': { shortName: 'Sep' },
  '10': { shortName: 'Oct' },
  '11': { shortName: 'Nov' },
  '12': { shortName: 'Dec' },
}

export function parseTimestamp(timestamp: number) {
  const isoString = new Date(timestamp * 1000).toISOString()
  const [year, month, day] = isoString.slice(0, 10).split('-')
  assert(year !== undefined, 'Year is undefined')
  assert(month !== undefined, 'Month is undefined')
  assert(day !== undefined, 'Day is undefined')

  const time = isoString.slice(11, 16)
  return {
    year,
    month,
    day,
    time,
  }
}

function formatTimeAndDate(
  date: string,
  time: string,
  mode: 'date' | 'datetime' | 'time' = 'date',
) {
  switch (mode) {
    case 'date':
      return date
    case 'time':
      return `${time} UTC`
    case 'datetime':
      return `${date}, ${time} UTC`
  }
}

/** "1 Jul 2026", or "1 Jul" / "1" when a range already shows the rest. */
function toNiceDate(day: string, month?: string, year?: string) {
  const dayNumber = String(Number(day))
  if (!month) return dayNumber

  const monthName = MONTHS[month]?.shortName
  assert(monthName !== undefined, 'Invalid month')
  return year
    ? `${dayNumber} ${monthName} ${year}`
    : `${dayNumber} ${monthName}`
}

export function formatRange(from: number, to: number) {
  const parsedFrom = parseTimestamp(from)
  const parsedTo = parseTimestamp(to)

  if (to - from >= 23 * UnixTime.HOUR) {
    // "30 Jun — 2 Jul 2026": the start drops the parts it shares with the end
    const sameYear = parsedFrom.year === parsedTo.year
    const fromDate = toNiceDate(
      parsedFrom.day,
      sameYear && parsedFrom.month === parsedTo.month
        ? undefined
        : parsedFrom.month,
      sameYear ? undefined : parsedFrom.year,
    )
    const toDate = toNiceDate(parsedTo.day, parsedTo.month, parsedTo.year)
    return `${fromDate} ${EM_DASH}\n${toDate}`
  }

  // "30 Jun 2026, 01:00 — 02:00 UTC"
  const date = toNiceDate(parsedFrom.day, parsedFrom.month, parsedFrom.year)
  return `${date}, ${parsedFrom.time} ${EM_DASH} ${parsedTo.time} UTC`
}

export function formatTimestamp(
  timestamp: number,
  opts?: {
    mode?: 'date' | 'datetime' | 'time'
  },
) {
  const { year, month, day, time } = parseTimestamp(timestamp)
  const date = toNiceDate(day, month, year)
  return formatTimeAndDate(date, time, opts?.mode)
}

export function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  assert(day !== undefined, 'Day is undefined')
  return toNiceDate(day, month, year)
}

/**
 * The instant in the visitor's time zone, e.g. "1 Jul 2026, 16:00 UTC+2", or
 * undefined when that zone is at UTC+0 then. Call it only in the browser: on
 * the server it would use the server's zone.
 */
export function formatLocalDateTime(timestamp: number) {
  if (new Date(timestamp * 1000).getTimezoneOffset() === 0) return undefined

  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'shortOffset',
  }).formatToParts(timestamp * 1000)
  const part = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((p) => p.type === type)?.value
    assert(value !== undefined, 'Missing date part')
    return value
  }

  const zone = part('timeZoneName').replace('GMT', 'UTC')
  const date = toNiceDate(part('day'), part('month'), part('year'))
  return `${date}, ${part('hour')}:${part('minute')} ${zone}`
}

export function getNextDateForDayOfWeek(
  dayOfWeek: number,
  currentDate = new Date(),
): Date {
  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error('Day must be between 0 (Sunday) and 6 (Saturday)')
  }

  const currentDayOfWeek = currentDate.getUTCDay()
  let daysToAdd = dayOfWeek - currentDayOfWeek

  if (daysToAdd <= 0) {
    daysToAdd += 7
  }

  currentDate.setUTCDate(currentDate.getUTCDate() + daysToAdd)
  currentDate.setUTCHours(0, 0, 0, 0)

  return currentDate
}

/**
 * In UTC: publication dates are calendar days, stored as midnight UTC, and
 * the same date must render on the server and in every visitor's timezone.
 */
export const formatPublicationDate = (date: Date) => {
  const monthName = String(date.getUTCMonth() + 1).padStart(2, '0')
  const monthRecord = MONTHS[monthName]
  assert(monthRecord !== undefined, `Invalid month: ${monthName}`)

  return `${date.getUTCDate()} ${monthRecord.shortName} ${date.getUTCFullYear()}`
}
