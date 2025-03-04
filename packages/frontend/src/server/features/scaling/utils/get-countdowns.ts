import type {
  Project,
  ReasonForBeingInOther,
  ScalingProjectCategory,
} from '@l2beat/config'
import { PROJECT_COUNTDOWNS } from '@l2beat/config'

export interface ProjectCountdownsWithContext {
  otherMigration:
    | {
        expiresAt: number
        pretendingToBe: ScalingProjectCategory
        reasons: ReasonForBeingInOther[]
      }
    | undefined
}

export function getCountdowns(
  project: Project<'scalingInfo'>,
): ProjectCountdownsWithContext {
  return {
    otherMigration:
      project.scalingInfo.reasonsForBeingOther &&
      project.scalingInfo.type !== 'Other'
        ? {
            expiresAt: PROJECT_COUNTDOWNS.otherMigration.toNumber(),
            pretendingToBe: project.scalingInfo.type,
            reasons: project.scalingInfo.reasonsForBeingOther,
          }
        : undefined,
  }
}
