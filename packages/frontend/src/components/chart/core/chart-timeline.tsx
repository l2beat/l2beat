'use client'
import { UnixTime } from '@l2beat/shared-pure'
import { clamp } from 'lodash'
import type { ReactNode } from 'react'
import { useMemo, useRef } from 'react'
import { useIsClient } from '~/hooks/use-is-client'
import { MONTHS, parseTimestamp } from '~/utils/dates'
import type { ChartColumn } from './chart-context'
import { useChartContext } from './chart-context'
import { useChartLoading } from './chart-loading-context'
import { useChartRect } from './chart-rect-context'

export function ChartTimeline() {
  const isClient = useIsClient()
  const loading = useChartLoading()
  const { columns } = useChartContext()
  if (loading || !isClient || columns.length === 0) {
    return null
  }

  const range = getActualRange(columns)

  return (
    <div className="mt-2 w-full">
      {columns.map((column, i) => {
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
      })}
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

function getActualRange(columns: ChartColumn[]) {
  const timestamps = columns.map((column) => column.data.timestamp)
  const minTimestamp = new UnixTime(Math.min(...timestamps))
  const maxTimestamp = new UnixTime(Math.max(...timestamps))

  const actualRangeInDays =
    (maxTimestamp.toStartOf('day').toNumber() -
      minTimestamp.toStartOf('day').toNumber()) /
    UnixTime.DAY
  return actualRangeInDays
}

function getTimelineLabel(
  timestamp: number,
  range: number,
): string | undefined {
  if (range <= 1) {
    return get1dTimelineLabel(timestamp)
  }
  if (range <= 7) {
    return get7dTimelineLabel(timestamp)
  }
  if (range <= 30) {
    return get30dTimelineLabel(timestamp)
  }
  if (range <= 90) {
    return get90dTimelineLabel(timestamp)
  }
  if (range <= 180) {
    return get180dTimelineLabel(timestamp)
  }
  if (range <= 365) {
    return get1yTimelineLabel(timestamp)
  }
  if (range <= 730) {
    return get2yTimelineLabel(timestamp)
  }
  if (range <= 1095) {
    return get3yTimelineLabel(timestamp)
  }
  return getOver3yTimelineLabel(timestamp)
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
  if ((timestamp + 3 * UnixTime.DAY) % (21 * UnixTime.DAY) !== 0) {
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

function get2yTimelineLabel(timestamp: number) {
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

function get3yTimelineLabel(timestamp: number) {
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
