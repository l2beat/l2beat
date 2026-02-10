import type { LivenessOverwriteMode } from '@l2beat/config'
import type { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'

export type LivenessTimeRange = '30d' | '90d' | 'max'

export interface LivenessDataPoint {
  averageInSeconds: number
  minimumInSeconds: number
  maximumInSeconds: number
}

export interface LivenessAnomaly {
  start: UnixTime
  end: UnixTime | undefined
  durationInSeconds: number
  subtype: TrackedTxsConfigSubtype
  avgInterval: number
  isApproved: boolean
}

export interface LivenessDetails {
  '30d'?: LivenessDataPoint | null | LivenessOverwriteMode
  '90d'?: LivenessDataPoint | null | LivenessOverwriteMode
  max?: LivenessDataPoint | null | LivenessOverwriteMode
  syncedUntil: number
}

export interface LivenessProject {
  batchSubmissions?: LivenessDetails
  stateUpdates?: LivenessDetails
  proofSubmissions?: LivenessDetails
  anomalies: LivenessAnomaly[]
}

export type LivenessResponse = Record<string, LivenessProject>
