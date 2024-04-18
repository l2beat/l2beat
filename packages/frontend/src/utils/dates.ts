import { UnixTime } from '@l2beat/shared-pure'

const MONTHS: Record<
  string,
  {
    longName: string
    shortName: string
  }
> = {
  '01': { shortName: 'Jan', longName: 'January' },
  '02': { shortName: 'Feb', longName: 'February' },
  '03': { shortName: 'Mar', longName: 'March' },
  '04': { shortName: 'Apr', longName: 'April' },
  '05': { shortName: 'May', longName: 'May' },
  '06': { shortName: 'Jun', longName: 'June' },
  '07': { shortName: 'Jul', longName: 'July' },
  '08': { shortName: 'Aug', longName: 'August' },
  '09': { shortName: 'Sep', longName: 'September' },
  '10': { shortName: 'Oct', longName: 'October' },
  '11': { shortName: 'Nov', longName: 'November' },
  '12': { shortName: 'Dec', longName: 'December' },
}

export function parseTimestamp(timestamp: number) {
  const isoString = new Date(timestamp * 1000).toISOString()
  const [year, month, day] = isoString.slice(0, 10).split('-')
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
      return `${time} (UTC)`
    case 'datetime':
      return `${date}, ${time} (UTC)`
  }
}

function toNiceDate(
  day: string,
  month?: string,
  year?: string,
  longMonthName = false,
) {
  if (month && year) {
    const monthName = longMonthName
      ? MONTHS[month].longName
      : MONTHS[month].shortName
    return `${year} ${monthName} ${day}`
  }
  if (month) {
    const monthName = longMonthName
      ? MONTHS[month].longName
      : MONTHS[month].shortName
    return `${monthName} ${day}`
  }
  return day
}

export function formatRange(from: number, to: number) {
  const parsedFrom = parseTimestamp(from)
  const parsedTo = parseTimestamp(to)
  const fromDate = toNiceDate(parsedFrom.day, parsedFrom.month, parsedFrom.year)
  const toDate = toNiceDate(
    parsedTo.day,
    parsedFrom.month === parsedTo.month && parsedFrom.year === parsedTo.year
      ? undefined
      : parsedTo.month,
    parsedFrom.year === parsedTo.year ? undefined : parsedTo.year,
  )
  return `${fromDate} &ndash;\n${toDate}`
}

export function formatTimestamp(
  timestamp: number,
  opts?: {
    mode?: 'date' | 'datetime' | 'time'
    longMonthName?: boolean
  },
) {
  const { year, month, day, time } = parseTimestamp(timestamp)
  const date = toNiceDate(day, month, year, opts?.longMonthName)
  return formatTimeAndDate(date, time, opts?.mode)
}

export function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return toNiceDate(day, month, year)
}

export function formatTimestampToDateWithHour(timestamp: UnixTime) {
  const { year, month, day, time } = parseTimestamp(timestamp.toNumber())

  const monthAbbr = MONTHS[month].shortName
  const numericDay = +day

  const daySuffix =
    numericDay >= 11 && numericDay <= 13
      ? 'th'
      : numericDay % 10 === 1
        ? 'st'
        : numericDay % 10 === 2
          ? 'nd'
          : numericDay % 10 === 3
            ? 'rd'
            : 'th'

  const numericHour = +time.slice(0, 2)

  const hour = numericHour % 12 || 12
  const ampm = numericHour >= 12 ? 'PM' : 'AM'
  const minute = String(time.slice(3, 5)).padStart(2, '0')

  const formattedDate = `${hour}:${minute} ${ampm} UTC, ${monthAbbr} ${day}${daySuffix} ${year}`

  return formattedDate
}

export function getNextDateForDayOfWeek(
  dayOfWeek: number,
  currentDate = new Date(),
): Date {
  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error('Day must be between 0 (Sunday) and 6 (Saturday)')
  }

  const currentDayOfWeek = currentDate.getDay()
  let daysToAdd = dayOfWeek - currentDayOfWeek

  if (daysToAdd <= 0) {
    daysToAdd += 7
  }

  currentDate.setUTCDate(currentDate.getDate() + daysToAdd)
  currentDate.setUTCHours(0, 0, 0, 0)

  return currentDate
}

export const formatPublicationDate = (date: Date) =>
  `${date.getDate()} ${MONTHS[String(date.getMonth() + 1).padStart(2, '0')].shortName} ${date.getFullYear()}`
