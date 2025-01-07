import {
  type Layer2,
  type Layer3,
  PROJECT_COUNTDOWNS,
  type ScalingProjectCategory,
} from '@l2beat/config'
import { type ReasonForBeingInOther } from '@l2beat/config/build/src/common/ReasonForBeingInOther'

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
