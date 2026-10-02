import type { StageSummary } from '@l2beat/config'

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
  return { upcoming, effective, forLabel }
}
