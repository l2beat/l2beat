import { StageConfig } from '@l2beat/config'

export function getStageOrderValue(stageConfig: StageConfig) {
  const stage = stageConfig.stage
  if (stage === 'NotApplicable' || stage === 'UnderReview') {
    return undefined
  }
  if (stage === 'Stage 0') {
    if (stageConfig.message?.type === 'warning') {
      return 0
    }

    if (stageConfig.message?.type === 'underReview') {
      return 1
    }

    return 2
  }
  if (stage === 'Stage 1') {
    return 3
  }
  return 4
}
