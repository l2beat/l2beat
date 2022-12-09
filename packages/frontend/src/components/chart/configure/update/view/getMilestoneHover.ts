import { Milestone } from '@l2beat/config'

const ICON_HEIGHT = 25

export function getMilestoneHover(
  mouseX: number,
  mouseY: number,
  points: { x: number; y: number; milestone?: Milestone }[] | undefined,
) {
  if (points === undefined) {
    return undefined
  }
  for (const [index, point] of points.entries()) {
    if (point.milestone) {
      const milestoneProximity = Math.abs(point.x - mouseX)
      if (mouseY <= ICON_HEIGHT && milestoneProximity < 0.015) {
        return index
      }
    }
  }
  return undefined
}
