import type { LivenessOverwriteMode, Project } from '@l2beat/config'
import type {
  LivenessDataPoint,
  LivenessDetails,
  LivenessProject,
} from '../types'

interface LivenessTypeData {
  '30d': LivenessDataPoint | undefined | null | LivenessOverwriteMode
  '90d': LivenessDataPoint | undefined | null | LivenessOverwriteMode
  max: LivenessDataPoint | undefined | null | LivenessOverwriteMode
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
      project.livenessInfo.overwrites?.stateUpdates,
    ),
    batchSubmissions: getSubTypeData(
      liveness.batchSubmissions,
      project.livenessInfo.warnings?.batchSubmissions,
      project.livenessInfo.overwrites?.batchSubmissions,
    ),
    proofSubmissions: getSubTypeData(
      liveness.proofSubmissions,
      project.livenessInfo.warnings?.proofSubmissions,
      project.livenessInfo.overwrites?.proofSubmissions,
    ),
    isSynced,
  }
}

function getSubTypeData(
  data: LivenessDetails | undefined,
  warning: string | undefined,
  overwrite: LivenessOverwriteMode | undefined,
): LivenessTypeData | undefined {
  if (overwrite === 'no-data')
    return {
      '30d': 'no-data',
      '90d': 'no-data',
      max: 'no-data',
      warning,
    }

  if (data === undefined) return undefined
  return {
    '30d': data['30d'],
    '90d': data['90d'],
    max: data.max,
    warning,
  }
}
