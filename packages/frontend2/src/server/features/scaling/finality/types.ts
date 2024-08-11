import { type DataAvailabilityMode } from '@l2beat/config'
import { type WarningValueWithSentiment } from '@l2beat/shared-pure'
import { type SyncStatus } from '~/types/SyncStatus'
import { type CommonScalingEntry } from '../get-common-scaling-entry'
import { type FinalityDataPoint } from './schema'

export type ScalingFinalityEntry = CommonScalingEntry & {
  entryType: 'finality'
  dataAvailabilityMode?: DataAvailabilityMode
  data: ScalingFinalityEntryData | undefined
  finalizationPeriod?: number
}

export interface ScalingFinalityEntryData {
  timeToInclusion: {
    warning?: WarningValueWithSentiment
  } & FinalityDataPoint
  stateUpdateDelay?: {
    warning?: WarningValueWithSentiment
    averageInSeconds: number
  }
  syncStatus: SyncStatus
}
