import type { Row } from '@tanstack/react-table'
import { isAssignedStage } from '~/utils/project/isAssignedStage'
import type { TableStage } from '../cells/stage/tableStage'

export function sortStages<TData extends { stage: TableStage }>(
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

function getStageOrderValue(stageConfig: TableStage) {
  const stage = stageConfig.stage
  if (!isAssignedStage(stage)) {
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
