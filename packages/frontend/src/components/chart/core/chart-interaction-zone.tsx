import { useCallback, useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { useChartContext } from './chart-context'
import { useChartHoverContext } from './chart-hover-context'
import { useChartRect } from './chart-rect-context'
import { getHoveredColumn } from './utils/get-hovered-column'

export function ChartInteractionZone() {
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const chartContext = useChartContext()
  const { rect } = useChartRect()
  const chartHoverContext = useChartHoverContext()

  const onWindowMoveEvent = useCallback(
    (e: MouseEvent | Touch) => {
      const zone = ref.current
      if (!zone) return
      const rect = zone.getBoundingClientRect()
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!isInside) {
        chartHoverContext.setPosition(undefined)
      }
    },
    [chartHoverContext],
  )

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

  useEventListener('mousemove', onWindowMoveEvent)
  useEventListener('touchmove', (e) => {
    const touch = e.touches[0]
    if (!touch) return
    onWindowMoveEvent(touch)
  })

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
    <div
      ref={ref}
      className="absolute -inset-x-4 inset-y-0 z-40 lg:-bottom-4"
    />
  )
}
