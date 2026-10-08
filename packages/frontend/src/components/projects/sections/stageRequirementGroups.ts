import type { StageConfigured, StageSummary } from '@l2beat/config'

type Requirement = Pick<StageSummary['requirements'][number], 'satisfied'>

/**
 * How a stage's requirements are split for display, shared by the stage
 * section and its markdown. Upcoming guidelines are listed apart only until
 * the stage changes take effect; afterwards they count like any other
 * requirement. Until then a stage with a principle is judged by it alone.
 */
export function getStageRequirementGroups(
  stage: StageSummary,
  showUpcomingGuidelines: boolean,
) {
  const upcoming = showUpcomingGuidelines
    ? stage.requirements.filter((r) => r.upcoming)
    : []
  const effective = showUpcomingGuidelines
    ? stage.requirements.filter((r) => !r.upcoming)
    : stage.requirements
  const forLabel = stage.principle
    ? showUpcomingGuidelines
      ? [stage.principle]
      : [stage.principle, ...effective]
    : effective
  return {
    upcoming,
    effective: splitBySatisfaction(effective),
    forLabel: splitBySatisfaction(forLabel),
  }
}

function splitBySatisfaction<T extends Requirement>(requirements: T[]) {
  return {
    met: requirements.filter((r) => r.satisfied === true),
    underReview: requirements.filter((r) => r.satisfied === 'UnderReview'),
    missing: requirements.filter((r) => r.satisfied === false),
  }
}

export function requirementsMetText(count: number) {
  return count === 1 ? '1 requirement met' : `${count} requirements met`
}

export function issuesToFixText(count: number) {
  return count === 1 ? '1 issue needs fixing' : `${count} issues need fixing`
}

/** A project in Others that misses Stage 0 requirements is not called a Stage 0 project. */
export function isBelowStage0(
  type: string,
  stageConfig: Pick<StageConfigured, 'missing'>,
) {
  return type === 'Other' && !!stageConfig.missing?.requirements
}
