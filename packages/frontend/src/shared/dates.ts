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
  return time === undefined ? date : `${time} ${date} (UTC)`
}

function toNiceDate(day: string, month: string, year?: string) {
  return year === undefined
    ? `${parseInt(day)} ${MONTHS[month]}`
    : `${parseInt(day)} ${MONTHS[month]} ${parseInt(year)}`
}

export function formatRange(from: number, to: number, withTime = false) {
  const parsedFrom = parseTimestamp(from)
  const parsedTo = parseTimestamp(to)
  const sameYear = parsedFrom.year === parsedTo.year
  const fromDate = toNiceDate(
    parsedFrom.day,
    parsedFrom.month,
    sameYear ? undefined : parsedFrom.year,
  )
  const toDate = toNiceDate(parsedTo.day, parsedTo.month, parsedTo.year)
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
