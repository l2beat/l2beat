import { UnixTime } from '@l2beat/shared-pure'
import type { XAxisProps } from 'recharts'
import { MONTHS, parseTimestamp } from '~/utils/dates'

const common: XAxisProps = {
  dataKey: 'timestamp',
  tickLine: false,
  axisLine: false,
}

export function getXAxisProps<T extends { timestamp: number }>(
  data: T[] | undefined,
): XAxisProps {
  if (!data || data.length === 0) {
    return {
      ...common,
      ticks: [],
    }
  }
  const timestamps = data.map((point) => point.timestamp)
  const minTimestamp = new UnixTime(Math.min(...timestamps))
  const maxTimestamp = new UnixTime(Math.max(...timestamps))

  const actualRangeInDays =
    (maxTimestamp.toStartOf('day').toNumber() -
      minTimestamp.toStartOf('day').toNumber()) /
    UnixTime.DAY

  return {
    ...common,
    ticks: timestamps.filter(getCondition(actualRangeInDays)),
    tickFormatter: getTickFormatter(actualRangeInDays),
  }
}

function getCondition(actualRangeInDays: number) {
  return (timestamp: number) => {
    const start = new UnixTime(timestamp)
    const date = start.toDate()

    if (actualRangeInDays <= 1) return timestamp % (4 * UnixTime.HOUR) === 0
    if (actualRangeInDays <= 7) return timestamp % UnixTime.DAY === 0
    if (actualRangeInDays <= 30)
      return start.toNumber() % UnixTime.DAY === 0 && date.getDay() === 1
    if (actualRangeInDays <= 90)
      return (timestamp + 3 * UnixTime.DAY) % (21 * UnixTime.DAY) === 0
    if (actualRangeInDays <= 180)
      return start.toNumber() % UnixTime.DAY === 0 && date.getDate() === 1
    if (actualRangeInDays <= 365)
      return (
        start.toNumber() % UnixTime.DAY === 0 &&
        date.getDate() === 1 &&
        date.getMonth() % 2 === 0
      )
    if (actualRangeInDays <= 1095)
      return (
        start.toNumber() % UnixTime.DAY === 0 &&
        date.getDate() === 1 &&
        date.getMonth() % 4 === 0
      )

    return (
      start.toNumber() % UnixTime.DAY === 0 &&
      date.getDate() === 1 &&
      date.getMonth() === 0
    )
  }
}

function getTickFormatter(actualRangeInDays: number) {
  return (timestamp: number) => {
    const { month, day, time, year } = parseTimestamp(timestamp)
    if (actualRangeInDays <= 1) return time
    if (actualRangeInDays <= 90) return `${day} ${MONTHS[month]?.shortName}`
    if (actualRangeInDays <= 1095)
      return `${MONTHS[month]?.shortName} ‘${year.slice(-2)}`
    return year
  }
}
