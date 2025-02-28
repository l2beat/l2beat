import type { ProjectScalingInfo, ReasonForBeingInOther } from '@l2beat/config'
import { featureFlags } from '~/consts/feature-flags'

export function isProjectOther(
  scalingInfo: ProjectScalingInfo,
  previewRecategorisation?: boolean,
) {
  const migrated = featureFlags.othersMigrated() || !!previewRecategorisation
  return (
    (migrated &&
      !!scalingInfo.reasonsForBeingOther &&
      scalingInfo.reasonsForBeingOther.length > 0) ||
    scalingInfo.type === 'Other'
  )
}

/** @deprecated */
export function isProjectOther_legacy<
  T extends {
    reasonsForBeingOther?: ReasonForBeingInOther[]
    display: {
      category: string
    }
  },
>(project: T, previewRecategorisation?: boolean) {
  const migrated = featureFlags.othersMigrated() || !!previewRecategorisation
  return (
    (migrated &&
      !!project.reasonsForBeingOther &&
      project.reasonsForBeingOther.length > 0) ||
    project.display.category === 'Other'
  )
}
