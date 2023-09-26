import { UnixTime } from '@l2beat/shared-pure'

const MONTHS: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

function parseTimestamp(timestamp: number) {
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

function formatTimeAndDate(date: string, time?: string) {
  return time === undefined ? date : `${date} ${time} (UTC)`
}

function toNiceDate(day: string, month?: string, year?: string) {
  if (month && year) {
    return `${year} ${MONTHS[month]} ${day}`
  }
  if (month) {
    return `${MONTHS[month]} ${day}`
  }
  return day
}

export function formatRange(from: number, to: number, withTime = false) {
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
  const first = formatTimeAndDate(
    fromDate,
    withTime ? parsedFrom.time : undefined,
  )
  const second = formatTimeAndDate(toDate, withTime ? parsedTo.time : undefined)
  return `${first} &ndash;\n${second}`
}

export function formatTimestamp(timestamp: number, withTime = false) {
  const { year, month, day, time } = parseTimestamp(timestamp)
  const date = toNiceDate(day, month, year)
  return formatTimeAndDate(date, withTime ? time : undefined)
}

export function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return toNiceDate(day, month, year)
}

export function formatTimestampToDateWithHour(timestamp: UnixTime) {
  const { year, month, day, time } = parseTimestamp(timestamp.toNumber())

  const monthAbbr = MONTHS[month]
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
