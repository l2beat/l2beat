import { Milestone } from '@l2beat/config'

import { isMobile } from '../../render/isMobile'

const ICON_HEIGHT = 25
const MAX_TRIGGER_PROXIMITY = 0.014

export function getMilestoneHoverIndex(
  mouseX: number,
  mouseY: number,
  points: { x: number; y: number; milestone?: Milestone }[] | undefined,
) {
  if (points === undefined) {
    return undefined
  }
  if (mouseY <= getYTriggerValue()) {
    let minProximity = Infinity
    let indexMinProximity = 0

    for (const [index, point] of points.entries()) {
      if (point.milestone) {
        const milestoneProximity = Math.abs(point.x - mouseX)
        if (milestoneProximity < minProximity) {
          minProximity = milestoneProximity
          indexMinProximity = index
        }
      }
    }

    if (minProximity < MAX_TRIGGER_PROXIMITY) {
      return indexMinProximity
    }
  }

  return undefined
}

function getYTriggerValue() {
  if (isMobile()) {
    return ICON_HEIGHT + 5
  }

  return ICON_HEIGHT
}
