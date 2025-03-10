import type { ProjectScalingStage } from '@l2beat/config'
import type { Row } from '@tanstack/react-table'

export function sortStages<TData extends { stage: ProjectScalingStage }>(
  rowA: Row<TData>,
  rowB: Row<TData>,
) {
  const stageOrderValueA = getStageOrderValue(rowA.original.stage)
  if (stageOrderValueA === undefined) {
    return -1
  }
  const stageOrderValueB = getStageOrderValue(rowB.original.stage)
  if (stageOrderValueB === undefined) {
    return 1
  }

  return stageOrderValueA > stageOrderValueB ? 1 : -1
}

function getStageOrderValue(stageConfig: ProjectScalingStage) {
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
