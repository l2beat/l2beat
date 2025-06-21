import type { ProjectScalingInfo } from '@l2beat/config'

export function isProjectOther(scalingInfo: ProjectScalingInfo) {
  return (
    (!!scalingInfo.reasonsForBeingOther &&
      scalingInfo.reasonsForBeingOther.length > 0) ||
    scalingInfo.type === 'Other'
  )
}
