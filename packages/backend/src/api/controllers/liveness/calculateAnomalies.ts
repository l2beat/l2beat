import { LivenessType } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

import { LivenessRecordsWithIntervalAndDetails } from './calculateIntervalWithAverages'

export function calculateAnomalies(
  projects: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
    stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
  }>,
) {
  const result: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
    stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
    anomalies: {
      timestamp: number
      durationInSeconds: number
      type: LivenessType
    }[]
  }> = {}
  for (const p in projects) {
    const batchSubmissions = projects[p].batchSubmissions
    const stateUpdates = projects[p].stateUpdates

    // TODO: implement anomalies calculations

    result[p] = {
      batchSubmissions: batchSubmissions,
      stateUpdates: stateUpdates,
      anomalies: [],
    }
  }
  return result
}
