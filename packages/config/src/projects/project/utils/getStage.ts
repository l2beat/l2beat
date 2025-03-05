import type { ScalingProjectStage, ProjectScalingStage } from '../../../types'

export function getStage(config: ProjectScalingStage): ScalingProjectStage {
  if (config.stage === 'NotApplicable') {
    return 'Not applicable'
  }
  if (config.stage === 'UnderReview') {
    return 'Under review'
  }
  return config.stage
}
