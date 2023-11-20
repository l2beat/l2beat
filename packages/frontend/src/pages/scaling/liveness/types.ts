import { Layer2, StageConfig } from '@l2beat/config'

import { AnomalyIndicatorEntry } from '../../../components/AnomalyIndicator'

interface DataPoint {
  averageInSeconds: number
  maximumInSeconds: number
}

export interface ScalingLivenessViewEntry {
  name: string
  slug: string
  category: Layer2['display']['category']
  provider: Layer2['display']['provider'] | undefined
  warning: string | undefined
  stage: StageConfig
  batchSubmissions?:
    | {
        last30Days?: DataPoint | undefined
        last90Days?: DataPoint | undefined
        max?: DataPoint | undefined
      }
    | undefined
  stateUpdates?:
    | {
        last30Days?: DataPoint | undefined
        last90Days?: DataPoint | undefined
        max?: DataPoint | undefined
      }
    | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
}
