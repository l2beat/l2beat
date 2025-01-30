import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo, useRef } from 'react'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { useEventListener } from '~/hooks/use-event-listener'
import { useIsClient } from '~/hooks/use-is-client'
import { useChartContext } from './chart-context'
import { useChartHoverContext } from './chart-hover-context'
import { useChartLoading } from './chart-loading-context'
import { useChartRect } from './chart-rect-context'
import { getHoveredColumn } from './utils/get-hovered-column'

export function ChartMilestones() {
  const ref = useRef<HTMLDivElement>(null)
  const loading = useChartLoading()
  const chartContext = useChartContext()
  const chartHoverContext = useChartHoverContext()
  const isMobile = useIsMobile()
  const { rect } = useChartRect()
  const isClient = useIsClient()

  const onCanvasMoveEvent = useCallback(
    (event: MouseEvent | Touch) => {
      const { columns, valuesStyle, getY } = chartContext
      if (!rect || !columns || !valuesStyle || !getY) return
      const hoveredColumn = getHoveredColumn({
        event,
        rect,
        columns,
        valuesStyle,
        getY,
        isMobile,
      })
      if (!hoveredColumn) return

      chartHoverContext.setData(hoveredColumn.column.data)
      chartHoverContext.setPosition({
        left: hoveredColumn.left,
        bottom: hoveredColumn.yValues,
      })
      chartHoverContext.setMilestone(hoveredColumn.column?.milestone)
    },
    [chartContext, chartHoverContext, isMobile, rect],
  )

  useEventListener('mousemove', onCanvasMoveEvent, ref)
  useEventListener(
    'touchmove',
    (e) => {
      const touch = e.touches[0]
      if (!touch) return
      onCanvasMoveEvent(touch)
    },
    ref,
  )

  return (
    <div ref={ref} className="absolute bottom-0 w-full">
      {!loading && isClient
        ? chartContext.columns.map(
            (c, i) =>
              c.milestone && (
                <ChartMilestone
                  key={i}
                  x={i / (chartContext.columns.length - 1)}
                  milestone={c.milestone}
                />
              ),
          )
        : null}
    </div>
  )
}

const milestoneSize = 20
interface Props {
  x: number
  milestone: Milestone
}

function ChartMilestone({ x, milestone }: Props) {
  const { rect } = useChartRect()
  const style = useMemo(
    () =>
      rect
        ? {
            left: rect.width * x - milestoneSize / 2,
            top: -milestoneSize / 2,
          }
        : undefined,
    [rect, x],
  )

  // Prevent rendering of milestones without a style (all of them would render on the left bottom side of the chart)
  if (!style) {
    return null
  }

  return (
    <div className="absolute scale-75 select-none md:scale-100" style={style}>
      <a
        href={milestone.url}
        target="_blank"
        className="pointer-events-none md:pointer-events-auto"
      >
        <svg
          width={milestoneSize}
          height={milestoneSize}
          viewBox={`0 0 ${milestoneSize} ${milestoneSize}`}
          role="img"
          aria-label={
            milestone.type === 'general' ? 'Milestone icon' : 'Incident icon'
          }
          className="fill-green-700 stroke-green-500"
        >
          {milestone.type === 'general' ? (
            <rect
              x="9.89941"
              y="1.41421"
              width="12"
              height="12"
              rx="1"
              transform="rotate(45 9.89941 1.41421)"
              strokeWidth="2"
            />
          ) : (
            <path
              className="fill-red-800 stroke-red-700"
              d="M2.11842 14.4966L9.13637 2.46527C9.52224 1.80374 10.4781 1.80375 10.864 2.46528L17.882 14.497C18.2708 15.1637 17.7899 16.0008 17.0182 16.0008L10.0003 16.0008L10.0002 16.0008L2.98214 16.0004C2.21039 16.0004 1.72956 15.1632 2.11842 14.4966Z"
              strokeWidth="2"
            />
          )}
        </svg>
      </a>
    </div>
  )
}
