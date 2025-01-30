import type {
  Layer2,
  Layer3,
  ReasonForBeingInOther,
  ScalingProjectCategory,
} from '@l2beat/config'
import { PROJECT_COUNTDOWNS } from '@l2beat/config'

export interface ProjectCountdownsWithContext {
  otherMigration?: {
    expiresAt: number
    pretendingToBe: ScalingProjectCategory
    reasons: ReasonForBeingInOther[]
  }
}

export function getCountdowns(
  project: Layer2 | Layer3,
): ProjectCountdownsWithContext {
  const otherMigrationContext =
    PROJECT_COUNTDOWNS.otherMigration.getContext(project)
  return {
    otherMigration: otherMigrationContext
      ? {
          expiresAt: PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber(),
          pretendingToBe: project.display.category,
          reasons: otherMigrationContext.reasonsForBeingOther,
        }
      : undefined,
  }
}
