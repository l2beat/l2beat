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
  batchSubmissions:
    | {
        last30Days: DataPoint
        last90Days: DataPoint
        max: DataPoint
      }
    | undefined
  stateUpdates:
    | {
        last30Days: DataPoint
        last90Days: DataPoint
        max: DataPoint
      }
    | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
}
