import { Milestone } from '@l2beat/config'
import { useEffect, useRef } from 'react'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { ChartColumn, useChartContext } from './chart-context'
import { useChartHoverContext } from './chart-hover-context'
import { FIRST_LABEL_HEIGHT_PX } from './chart-labels'

const MILESTONE_MAX_Y = 25
const MILESTONE_MAX_Y_MOBILE = 30
const MILESTONE_CAPTURE_X = 20

export function ChartInteractionZone() {
  const ref = useRef<HTMLDivElement>(null)
  const breakpoint = useBreakpoint()
  const chartContext = useChartContext()
  const chartHoverContext = useChartHoverContext()

  const isMobile = breakpoint === 'mobile'

  useEffect(() => {
    const zone = ref.current
    const { rect, columns, valuesStyle, getY } = chartContext
    if (!zone || !rect) return

    const onWindowMoveEvent = (e: MouseEvent | Touch) => {
      const rect = zone.getBoundingClientRect()
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!isInside) {
        chartHoverContext.setPosition(undefined)
      }
    }

    const onCanvasMoveEvent = (e: MouseEvent | Touch) => {
      const position = (e.clientX - rect.left) / rect.width
      const x = Math.min(1, Math.max(0, position))
      const y = Math.abs(e.clientY - rect.top - rect.height)

      onMouseMoved(x, y)
    }

    const onMouseMoved = (mouseX: number, mouseY: number) => {
      const columnsLength = columns.length
      let columnIndex = Math.round(mouseX * (columnsLength - 1))
      let column = columns[columnIndex]

      const { width: canvasWidth, height: canvasHeight } = rect
      const getCanvasX = (index: number) =>
        (index / (columnsLength - 1)) * canvasWidth

      const milestoneHoverIndex = getMilestoneHoverIndex(
        mouseX,
        mouseY,
        canvasWidth,
        columns,
        getCanvasX,
      )

      if (milestoneHoverIndex !== undefined) {
        columnIndex = milestoneHoverIndex
        column = columns[columnIndex]
      }

      const left = getCanvasX(columnIndex)
      const yValues: (number | null)[] = []
      if (!column) return

      for (const [i, data] of column.values.entries()) {
        const pointStyle = valuesStyle[i]?.point
        if (!pointStyle) {
          yValues.push(null)
          continue
        }
        const y = getY(data.value)
        const bottom = Math.max(0, y * (canvasHeight - FIRST_LABEL_HEIGHT_PX))
        yValues.push(bottom)
      }
      chartHoverContext.setData(column.data)
      chartHoverContext.setPosition({ left, bottom: yValues })
      chartHoverContext.setMilestone(column?.milestone)
    }

    function getMilestoneHoverIndex(
      mouseX: number,
      mouseY: number,
      canvasWidth: number,
      columns: ChartColumn<unknown>[],
      getCanvasX: (index: number) => number,
    ) {
      const milestoneMouseY = isMobile
        ? MILESTONE_MAX_Y_MOBILE
        : MILESTONE_MAX_Y
      const mouseCanvasX = mouseX * canvasWidth

      if (mouseY < milestoneMouseY) {
        let result = Infinity
        let indexResult
        for (const [i, col] of columns.entries()) {
          if (col.milestone) {
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

    window.addEventListener('mousemove', onWindowMoveEvent)
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0]
      if (!touch) return
      onWindowMoveEvent(touch)
    })

    zone.addEventListener('mousemove', onCanvasMoveEvent)
    zone.addEventListener('touchmove', (e) => {
      const touch = e.touches[0]
      if (!touch) return
      onCanvasMoveEvent(touch)
    })

    return () => {
      window.removeEventListener('mousemove', onWindowMoveEvent)
      // window.removeEventListener('touchmove', onWindowMoveEvent)
      zone.removeEventListener('mousemove', onCanvasMoveEvent)
      // zone.removeEventListener('touchmove', onCanvasMoveEvent)
    }
  }, [isMobile, chartHoverContext, chartContext])

  return (
    <div
      ref={ref}
      className="-inset-x-4 -bottom-4 absolute top-0 z-40 group-data-[interactivity-disabled]/chart:hidden"
    />
  )
}
