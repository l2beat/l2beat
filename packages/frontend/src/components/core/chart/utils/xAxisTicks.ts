import { UnixTime } from '@l2beat/shared-pure'
import { MONTHS, parseTimestamp } from '~/utils/dates'

export function getTickCondition(actualRangeInDays: number) {
  return (timestamp: number) => {
    const start = UnixTime(timestamp)
    const date = UnixTime.toDate(start)

    if (actualRangeInDays <= 1) return timestamp % (4 * UnixTime.HOUR) === 0
    if (actualRangeInDays <= 7) return timestamp % UnixTime.DAY === 0
    if (actualRangeInDays <= 30)
      return start % UnixTime.DAY === 0 && date.getUTCDay() === 1
    if (actualRangeInDays <= 90)
      return (timestamp + 3 * UnixTime.DAY) % (21 * UnixTime.DAY) === 0
    if (actualRangeInDays <= 180)
      return start % UnixTime.DAY === 0 && date.getUTCDate() === 1
    if (actualRangeInDays <= 365)
      return (
        start % UnixTime.DAY === 0 &&
        date.getUTCDate() === 1 &&
        date.getUTCMonth() % 2 === 0
      )
    if (actualRangeInDays <= 1095)
      return (
        start % UnixTime.DAY === 0 &&
        date.getUTCDate() === 1 &&
        date.getUTCMonth() % 4 === 0
      )

    return (
      start % UnixTime.DAY === 0 &&
      date.getUTCDate() === 1 &&
      date.getUTCMonth() === 0
    )
  }
}

function getTickFormatter(actualRangeInDays: number) {
  return (timestamp: number) => {
    const { month, day, time, year } = parseTimestamp(timestamp)
    if (actualRangeInDays <= 1) return time
    if (actualRangeInDays <= 90)
      return `${Number(day)} ${MONTHS[month]?.shortName}`
    if (actualRangeInDays <= 1095)
      return `${MONTHS[month]?.shortName} ‘${year.slice(-2)}`
    return year
  }
}

/**
 * Time-axis ticks for rows at `xs`, spaced for the range they span. Ticks
 * whose labels would cross the plot's edges are left out by `fitXTicks`,
 * once the plot's width is known.
 */
export function getTimeTicks(xs: number[]) {
  const first = xs[0]
  const last = xs.at(-1)
  if (first === undefined || last === undefined) {
    return { values: [], format: String }
  }
  const rangeInDays =
    (UnixTime.toStartOf(UnixTime(last), 'day') -
      UnixTime.toStartOf(UnixTime(first), 'day')) /
    UnixTime.DAY
  return {
    values: xs.filter(getTickCondition(rangeInDays)),
    format: getTickFormatter(rangeInDays),
  }
}

/**
 * The ticks whose labels, centred on them, stay within a plot `plotWidth`
 * pixels wide that spans `domain`.
 */
export function fitXTicks(
  values: readonly number[],
  format: (value: number) => string,
  domain: readonly [number, number],
  plotWidth: number,
  fontSize: number,
) {
  const [from, to] = domain
  const span = to - from
  if (span <= 0 || plotWidth <= 0) return []
  return values.filter((value) => {
    const x = ((value - from) / span) * plotWidth
    const half = estimateLabelWidth(format(value), fontSize) / 2
    return x - half >= 0 && x + half <= plotWidth
  })
}

/**
 * The width of a label in the site's sans-serif at weight 500, from Roboto's
 * advances; a little wide, so a label that fits really does.
 */
export function estimateLabelWidth(text: string, fontSize: number) {
  let em = 0
  for (const char of text) em += charWidth(char)
  return em * fontSize
}

function charWidth(char: string) {
  if (/\s/u.test(char)) return 0.26
  // Tabular digits, all one width.
  if (/[0-9$]/u.test(char)) return 0.57
  if (/[.,:;'‘’|!ilIj]/u.test(char)) return 0.28
  if (/[mwMW%]/u.test(char)) return 0.9
  if (/[A-Z]/u.test(char)) return 0.67
  return 0.56
}
