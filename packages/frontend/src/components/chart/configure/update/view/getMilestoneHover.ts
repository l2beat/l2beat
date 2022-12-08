import { Milestone } from '@l2beat/config'

export function getMilestoneHover(
  mouseX: number,
  mouseY: number,
  points: { x: number; y: number; milestone?: Milestone }[] | undefined,
) {
  if (points === undefined) {
    return undefined
  }
  let index = 0
  for (const point of points) {
    if (point.milestone) {
      const milestoneProximity = Math.abs(point.x - mouseX)
      console.log(milestoneProximity)
      console.log(mouseY)
      if (mouseY < 16 && milestoneProximity < 0.015) {
        console.log('hovered milestone')
        return index
      }
    }
    index++
  }
  return undefined
}
