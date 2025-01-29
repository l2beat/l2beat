import type { ReasonForBeingInOther } from '@l2beat/config'
import { featureFlags } from '~/consts/feature-flags'

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
