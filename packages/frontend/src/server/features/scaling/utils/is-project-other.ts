import type { Project, ReasonForBeingInOther } from '@l2beat/config'
import { featureFlags } from '~/consts/feature-flags'

export function isProjectOther2(
  p: Project<'scalingInfo'>,
  previewRecategorisation?: boolean,
) {
  const migrated = featureFlags.othersMigrated() || !!previewRecategorisation
  return (
    (migrated &&
      !!p.scalingInfo.reasonsForBeingOther &&
      p.scalingInfo.reasonsForBeingOther.length > 0) ||
    p.scalingInfo.type === 'Other'
  )
}

export function isProjectOther<
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
