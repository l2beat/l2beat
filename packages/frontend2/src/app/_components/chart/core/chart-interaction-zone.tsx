import { useCallback, useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { getHoveredColumn } from '../utils/get-hovered-column'
import { useChartContext } from './chart-context'
import { useChartHoverContext } from './chart-hover-context'

export function ChartInteractionZone() {
  const ref = useRef<HTMLDivElement>(null)
  const breakpoint = useBreakpoint()
  const chartContext = useChartContext()
  const chartHoverContext = useChartHoverContext()

  const isMobile = breakpoint === 'mobile'

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

  return <div ref={ref} className="-inset-x-4 -bottom-4 absolute top-0 z-40" />
}
