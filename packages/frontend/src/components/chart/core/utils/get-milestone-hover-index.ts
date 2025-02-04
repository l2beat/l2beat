import type { ChartColumn } from '../chart-context'

const MILESTONE_MAX_Y = 25
const MILESTONE_MAX_Y_MOBILE = 30
const MILESTONE_CAPTURE_X = 20

export function getMilestoneHoverIndex({
  mouseX,
  mouseY,
  canvasWidth,
  columns,
  getCanvasX,
  isMobile,
}: {
  mouseX: number
  mouseY: number
  canvasWidth: number
  columns: ChartColumn[]
  getCanvasX: (index: number) => number
  isMobile: boolean
}) {
  const milestoneMouseY = isMobile ? MILESTONE_MAX_Y_MOBILE : MILESTONE_MAX_Y
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
