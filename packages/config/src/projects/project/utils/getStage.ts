import { StageConfig } from '../../layer2s'
import { ScalingProjectStage } from '../BaseProject'

export function getStage(config: StageConfig | undefined): ScalingProjectStage {
  if (!config || config.stage === 'NotApplicable') {
    return 'Not applicable'
  }
  if (config.stage === 'UnderReview') {
    return 'Under review'
  }
  return config.stage
}
