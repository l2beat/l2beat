import { Milestone } from '@l2beat/config'

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
      if (mouseY < 16 && milestoneProximity < 0.015) {
        return index
      }
    }
  }
  return undefined
}
