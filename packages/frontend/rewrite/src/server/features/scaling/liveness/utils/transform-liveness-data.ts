import type { Project } from '@l2beat/config'
import type {
  LivenessDataPoint,
  LivenessDetails,
  LivenessProject,
} from '../types'

interface LivenessTypeData {
  '30d': LivenessDataPoint | undefined
  '90d': LivenessDataPoint | undefined
  max: LivenessDataPoint | undefined
  warning: string | undefined
}

export interface LivenessData {
  stateUpdates: LivenessTypeData | undefined
  batchSubmissions: LivenessTypeData | undefined
  proofSubmissions: LivenessTypeData | undefined
  isSynced: boolean
}

export function transformLivenessData(
  liveness: LivenessProject,
  project: Project<'livenessInfo'>,
  isSynced: boolean,
): LivenessData {
  return {
    stateUpdates: getSubTypeData(
      liveness.stateUpdates,
      project.livenessInfo.warnings?.stateUpdates,
    ),
    batchSubmissions: getSubTypeData(
      liveness.batchSubmissions,
      project.livenessInfo.warnings?.batchSubmissions,
    ),
    proofSubmissions: getSubTypeData(
      liveness.proofSubmissions,
      project.livenessInfo.warnings?.proofSubmissions,
    ),
    isSynced,
  }
}

function getSubTypeData(
  data: LivenessDetails | undefined,
  warning: string | undefined,
): LivenessTypeData | undefined {
  if (!data) return undefined
  return {
    '30d': data['30d'],
    '90d': data['90d'],
    max: data.max,
    warning,
  }
}
