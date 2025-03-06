import type {
  Project,
  ProjectScalingCategory,
  ReasonForBeingInOther,
} from '@l2beat/config'
import { PROJECT_COUNTDOWNS } from '@l2beat/config'

export interface ProjectCountdownsWithContext {
  otherMigration:
    | {
        expiresAt: number
        pretendingToBe: ProjectScalingCategory
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
            expiresAt: PROJECT_COUNTDOWNS.otherMigration,
            pretendingToBe: project.scalingInfo.type,
            reasons: project.scalingInfo.reasonsForBeingOther,
          }
        : undefined,
  }
}
