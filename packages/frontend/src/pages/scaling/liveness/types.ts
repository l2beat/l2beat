import { Layer2, StageConfig } from '@l2beat/config'
import { LivenessDataPoint } from '@l2beat/shared-pure'

import { AnomalyIndicatorEntry } from '../../../components/AnomalyIndicator'

export interface ScalingLivenessViewEntry {
  name: string
  slug: string
  category: Layer2['display']['category']
  provider: Layer2['display']['provider'] | undefined
  warning: string | undefined
  stage: StageConfig
  batchSubmissions?:
    | {
        last30Days?: LivenessDataPoint | undefined
        last90Days?: LivenessDataPoint | undefined
        allTime?: LivenessDataPoint | undefined
      }
    | undefined
  stateUpdates?:
    | {
        last30Days?: LivenessDataPoint | undefined
        last90Days?: LivenessDataPoint | undefined
        allTime?: LivenessDataPoint | undefined
      }
    | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
}
