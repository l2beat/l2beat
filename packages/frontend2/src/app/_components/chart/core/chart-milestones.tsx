import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo, useRef } from 'react'
import { useChartContext } from './chart-context'
import { useEventListener } from '~/hooks/use-event-listener'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { useChartHoverContext } from './chart-hover-context'
import { getHoveredColumn } from '../utils/get-hovered-column'

export function ChartMilestones() {
  const ref = useRef<HTMLDivElement>(null)
  const chartContext = useChartContext()
  const chartHoverContext = useChartHoverContext()
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'

  const onCanvasMoveEvent = useCallback(
    (event: MouseEvent | Touch) => {
      const { rect, columns, valuesStyle, getY } = chartContext
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
    [chartContext, chartHoverContext, isMobile],
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

  if (!chartContext.rect) return null

  return (
    <div
      ref={ref}
      className="absolute bottom-0 z-40 w-full group-data-[interactivity-disabled]/chart:hidden"
    >
      {chartContext.columns.map(
        (c, i) =>
          c.milestone && (
            <ChartMilestone
              key={i}
              x={i / (chartContext.columns.length - 1)}
              milestone={c.milestone}
            />
          ),
      )}
    </div>
  )
}

const milestoneSize = 20
interface Props {
  x: number
  milestone: Milestone
}

function ChartMilestone({ x, milestone }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { rect } = useChartContext()
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

  return (
    <div
      ref={ref}
      className="absolute select-none scale-75 md:scale-100"
      style={style}
    >
      <a
        href={milestone.link}
        target="_blank"
        className="pointer-events-none md:pointer-events-auto"
      >
        <svg
          width={milestoneSize}
          height={milestoneSize}
          viewBox={`0 0 ${milestoneSize} ${milestoneSize}`}
          role="img"
          aria-label="Milestone icon"
          className="fill-green-700 stroke-green-500"
        >
          <rect
            x="9.89941"
            y="1.41421"
            width="12"
            height="12"
            rx="1"
            transform="rotate(45 9.89941 1.41421)"
            strokeWidth="2"
          />
        </svg>
      </a>
    </div>
  )
}
