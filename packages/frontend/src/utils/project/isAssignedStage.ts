import type { ProjectScalingStage, Stage } from '@l2beat/config'

export function isAssignedStage(
  stage: ProjectScalingStage['stage'],
): stage is Stage {
  return stage !== 'NotApplicable' && stage !== 'UnderReview'
}
