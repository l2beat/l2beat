import { type WarningValueWithSentiment } from '@l2beat/shared-pure'
import { type SyncStatus } from '~/types/SyncStatus'
import { type FinalityDataPoint } from './schema'
import { type CommonScalingEntry } from '../get-common-scaling-entry'
import { type DataAvailabilityMode } from '@l2beat/config'

export type ScalingFinalityEntry = CommonScalingEntry & {
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
