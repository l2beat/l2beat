import type { ScalingProjectStage, StageConfig } from '../../../types'

export function getStage(config: StageConfig): ScalingProjectStage {
  if (config.stage === 'NotApplicable') {
    return 'Not applicable'
  }
  if (config.stage === 'UnderReview') {
    return 'Under review'
  }
  return config.stage
}
