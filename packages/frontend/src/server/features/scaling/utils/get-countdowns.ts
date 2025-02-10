import type {
  Layer2,
  Layer3,
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
  project: Layer2 | Layer3,
): ProjectCountdownsWithContext {
  return {
    otherMigration:
      project.reasonsForBeingOther && project.display.category !== 'Other'
        ? {
            expiresAt: PROJECT_COUNTDOWNS.otherMigration.toNumber(),
            pretendingToBe: project.display.category,
            reasons: project.reasonsForBeingOther,
          }
        : undefined,
  }
}
