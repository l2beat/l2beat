import type { ProjectScalingStage, ProjectStageName } from '../../../types'

export function getStage(config: ProjectScalingStage): ProjectStageName {
  if (config.stage === 'NotApplicable') {
    return 'Not applicable'
  }
  if (config.stage === 'UnderReview') {
    return 'Under review'
  }
  return config.stage
}
