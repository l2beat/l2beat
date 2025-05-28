import type { ProjectScalingInfo } from '@l2beat/config'
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
