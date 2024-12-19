import { type ReasonForBeingInOther } from '@l2beat/config/build/src/common/ReasonForBeingInOther'
import { featureFlags } from '~/consts/feature-flags'

export function isProjectOther<
  T extends {
    display: {
      reasonsForBeingOther?: ReasonForBeingInOther[]
      category: string
    }
  },
>(project: T) {
  return (
    (featureFlags.othersMigrated() &&
      !!project.display.reasonsForBeingOther &&
      project.display.reasonsForBeingOther.length > 0) ||
    project.display.category === 'Other'
  )
}
