'use client'
import { UnixTime } from '@l2beat/shared-pure'
import { clamp } from 'lodash'
import { type ReactNode, useMemo, useRef } from 'react'
import { useIsClient } from '~/hooks/use-is-client'
import { MONTHS, parseTimestamp } from '~/utils/dates'
import { type TimeRange } from '~/utils/range/range'
import { type ChartColumn, useChartContext } from './chart-context'
import { useChartLoading } from './chart-loading-context'
import { useChartRect } from './chart-rect-context'

export function ChartTimeline() {
  const isClient = useIsClient()
  const loading = useChartLoading()
  const { columns } = useChartContext()
  if (columns.length === 0) {
    return null
  }

  const range = getActualRange(columns)

  return (
    <div className="mt-2 w-full">
      {!loading && isClient
        ? columns.map((column, i) => {
            const label = getTimelineLabel(column.data.timestamp, range)
            if (!label) return null
            return (
              <TimelineLabel
                key={column.data.timestamp}
                x={i / (columns.length - 1)}
              >
                {label}
              </TimelineLabel>
            )
          })
        : null}
    </div>
  )
}

function TimelineLabel({ x, children }: { x: number; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { rect } = useChartRect()

  const style = useMemo(() => {
    if (!ref.current || !rect) return undefined
    const pointX = rect.width * x

    return {
      left: clamp(
        pointX - ref.current.offsetWidth / 2,
        0,
        rect.width - ref.current.offsetWidth,
      ),
      visibility: 'visible' as const,
    }
  }, [rect, x])

  return (
    <span
      ref={ref}
      style={style}
      className="invisible absolute whitespace-nowrap text-3xs font-medium leading-none text-secondary"
    >
      {children}
    </span>
  )
}

type ActualRange = Exclude<TimeRange, 'max'> | number
function getActualRange(columns: ChartColumn[]): ActualRange {
  const timestamps = columns.map((column) => column.data.timestamp)
  const minTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)

  const actualRangeInDays = (maxTimestamp - minTimestamp) / UnixTime.DAY
  if (actualRangeInDays <= 1) {
    return '1d'
  }
  if (actualRangeInDays <= 7) {
    return '7d'
  }
  if (actualRangeInDays <= 30) {
    return '30d'
  }
  if (actualRangeInDays <= 90) {
    return '90d'
  }
  if (actualRangeInDays <= 180) {
    return '180d'
  }
  if (actualRangeInDays <= 365) {
    return '1y'
  }
  return actualRangeInDays
}

function getTimelineLabel(
  timestamp: number,
  range: ActualRange,
): string | undefined {
  switch (range) {
    case '1d':
      return get1dTimelineLabel(timestamp)
    case '7d':
      return get7dTimelineLabel(timestamp)
    case '30d':
      return get30dTimelineLabel(timestamp)
    case '90d':
      return get90dTimelineLabel(timestamp)
    case '180d':
      return get180dTimelineLabel(timestamp)
    case '1y':
      return get1yTimelineLabel(timestamp)
    default:
      return getMaxTimelineLabel(timestamp, range)
  }
}

function get1dTimelineLabel(timestamp: number) {
  if (timestamp % (4 * UnixTime.HOUR) !== 0) {
    return
  }

  const { time } = parseTimestamp(timestamp)
  return time
}

function get7dTimelineLabel(timestamp: number) {
  if (timestamp % UnixTime.DAY !== 0) {
    return
  }

  const { month, day } = parseTimestamp(timestamp)
  return `${day} ${MONTHS[month]?.shortName}`
}

function get30dTimelineLabel(timestamp: number) {
  const start = new UnixTime(timestamp)
  if (start.toNumber() % UnixTime.DAY !== 0 || start.toDate().getDay() !== 1) {
    return
  }

  const { month, day } = parseTimestamp(timestamp)
  return `${day} ${MONTHS[month]?.shortName}`
}

function get90dTimelineLabel(timestamp: number) {
  if (timestamp % (15 * UnixTime.DAY) !== 0) {
    return
  }

  const { month, day } = parseTimestamp(timestamp)
  return `${day} ${MONTHS[month]?.shortName}`
}

function get180dTimelineLabel(timestamp: number) {
  const start = new UnixTime(timestamp)
  if (start.toNumber() % UnixTime.DAY !== 0 || start.toDate().getDate() !== 1) {
    return
  }

  const { month, year } = parseTimestamp(timestamp)
  return `${MONTHS[month]?.shortName} ‘${year.slice(-2)}`
}

function get1yTimelineLabel(timestamp: number) {
  const start = new UnixTime(timestamp)
  if (
    start.toNumber() % UnixTime.DAY !== 0 ||
    start.toDate().getDate() !== 1 ||
    start.toDate().getMonth() % 2 !== 0
  ) {
    return
  }

  const { month, year } = parseTimestamp(timestamp)
  return `${MONTHS[month]?.shortName} ‘${year.slice(-2)}`
}

function getMaxTimelineLabel(timestamp: number, rangeInDays: number) {
  if (rangeInDays <= 730) {
    return getBelow2yTimelineLabel(timestamp)
  }
  if (rangeInDays <= 1095) {
    return getBelow3yTimelineLabel(timestamp)
  }
  return getOver3yTimelineLabel(timestamp)
}

function getBelow2yTimelineLabel(timestamp: number) {
  const start = new UnixTime(timestamp)
  if (
    start.toNumber() % UnixTime.DAY !== 0 ||
    start.toDate().getDate() !== 1 ||
    start.toDate().getMonth() % 4 !== 0
  ) {
    return
  }
  const { month, year } = parseTimestamp(timestamp)
  return `${MONTHS[month]?.shortName} ‘${year.slice(-2)}`
}

function getBelow3yTimelineLabel(timestamp: number) {
  const start = new UnixTime(timestamp)
  if (
    start.toNumber() % UnixTime.DAY !== 0 ||
    start.toDate().getDate() !== 1 ||
    start.toDate().getMonth() % 6 !== 0
  ) {
    return
  }
  const { month, year } = parseTimestamp(timestamp)
  return `${MONTHS[month]?.shortName} ‘${year.slice(-2)}`
}

function getOver3yTimelineLabel(timestamp: number) {
  const start = new UnixTime(timestamp)
  if (
    start.toNumber() % UnixTime.DAY !== 0 ||
    start.toDate().getDate() !== 1 ||
    start.toDate().getMonth() !== 0
  ) {
    return
  }
  const { year } = parseTimestamp(timestamp)
  return year
}
