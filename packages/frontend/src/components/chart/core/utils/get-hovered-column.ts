import type { ChartColumn } from '../chart-context'
import { FIRST_LABEL_HEIGHT_PX } from '../chart-labels'
import type { SeriesStyle } from '../styles'
import { getMilestoneHoverIndex } from './get-milestone-hover-index'

interface Props {
  event: MouseEvent | Touch
  rect: DOMRect
  columns: ChartColumn[]
  valuesStyle: SeriesStyle[]
  getY: (value: number) => number
  isMobile: boolean
}

export function getHoveredColumn({
  event,
  rect,
  columns,
  valuesStyle,
  getY,
  isMobile,
}: Props) {
  const position = (event.clientX - rect.left) / rect.width
  const mouseX = Math.min(1, Math.max(0, position))
  const mouseY = Math.abs(event.clientY - rect.top - rect.height)

  const columnsLength = columns.length
  let columnIndex = Math.round(mouseX * (columnsLength - 1))
  let column = columns[columnIndex]

  const { width: canvasWidth, height: canvasHeight } = rect
  const getCanvasX = (index: number) =>
    (index / (columnsLength - 1)) * canvasWidth

  const milestoneHoverIndex = getMilestoneHoverIndex({
    mouseX,
    mouseY,
    canvasWidth,
    columns,
    getCanvasX,
    isMobile,
  })

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

  return {
    left,
    yValues,
    column: {
      ...column,
      milestone:
        milestoneHoverIndex !== undefined ? column.milestone : undefined,
    },
  }
}
