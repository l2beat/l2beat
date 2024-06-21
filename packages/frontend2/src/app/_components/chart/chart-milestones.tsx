import { type Milestone } from '@l2beat/config'
import { useEffect, useMemo, useRef } from 'react'
import { type ChartColumn, useChartContext } from './chart-context'
import { useChartHoverContext } from './chart-hover-context'
import { FIRST_LABEL_HEIGHT_PX } from './chart-labels'

const MILESTONE_MAX_Y = 25
const MILESTONE_MAX_Y_MOBILE = 30
const MILESTONE_CAPTURE_X = 20

export function ChartMilestones() {
  const ref = useRef<HTMLDivElement>(null)
  const chartContext = useChartContext()
  const chartHoverContext = useChartHoverContext()

  useEffect(() => {
    const milestones = ref.current
    const { columns, rect, valuesStyle, getY } = chartContext
    const { setMilestone, setPosition } = chartHoverContext
    if (!milestones || !rect) return

    const onCanvasMoveEvent = (e: MouseEvent | Touch) => {
      const position = (e.clientX - rect.left) / rect.width
      const x = Math.min(1, Math.max(0, position))
      const y = Math.abs(e.clientY - rect.top - rect.height)

      onMouseMoved(x, y)
    }

    const onMouseMoved = (mouseX: number, mouseY: number) => {
      const pointsLength = columns.length
      const { width: canvasWidth, height: canvasHeight } = rect
      const getCanvasX = (index: number) =>
        (index / (pointsLength - 1)) * canvasWidth

      const milestoneHoverIndex = getMilestoneHoverIndex(
        mouseX,
        mouseY,
        canvasWidth,
        columns,
        getCanvasX,
      )

      if (!milestoneHoverIndex) {
        return
      }
      const column = columns[milestoneHoverIndex]
      if (!column) return
      const yValues: Record<number, number> = {}
      const left = getCanvasX(milestoneHoverIndex)
      for (const [i, data] of column.values.entries()) {
        const pointStyle = valuesStyle[i]?.point
        if (!pointStyle) continue
        const y = getY(data.value)
        const bottom = Math.max(0, y * (canvasHeight - FIRST_LABEL_HEIGHT_PX))
        yValues[i] = bottom
      }
      setPosition({ left, bottom: yValues })
      setMilestone(column?.milestone)
    }

    function getMilestoneHoverIndex(
      mouseX: number,
      mouseY: number,
      canvasWidth: number,
      points: ChartColumn<unknown>[],
      getCanvasX: (index: number) => number,
    ) {
      // TODO:isMobile()
      const milestoneMouseY = false ? MILESTONE_MAX_Y_MOBILE : MILESTONE_MAX_Y
      const mouseCanvasX = mouseX * canvasWidth

      if (mouseY < milestoneMouseY) {
        let result = Infinity
        let indexResult
        for (const [i, p] of points.entries()) {
          if (p.milestone) {
            const milestoneDistance = Math.abs(mouseCanvasX - getCanvasX(i))
            if (milestoneDistance < result) {
              result = milestoneDistance
              indexResult = i
            }
          }
        }
        if (result <= MILESTONE_CAPTURE_X && indexResult !== undefined) {
          return indexResult
        }
      }
    }

    function onMouseLeave() {
      setMilestone(undefined)
    }

    milestones.addEventListener('mousemove', onCanvasMoveEvent)
    milestones.addEventListener('touchmove', (e) => {
      const touch = e.touches[0]
      if (!touch) return
      onCanvasMoveEvent(touch)
    })
    milestones.addEventListener('mouseleave', onMouseLeave)

    return () => {
      milestones.removeEventListener('mousemove', onCanvasMoveEvent)
      // milestones.removeEventListener('touchmove', onCanvasMoveEvent)
      milestones.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [chartContext, chartHoverContext])

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
              x={i / chartContext.columns.length}
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
  const style = useMemo(
    () => ({
      left: `calc(${x * 100}% - ${milestoneSize / 2}px)`,
      top: -milestoneSize / 2,
    }),
    [x],
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
