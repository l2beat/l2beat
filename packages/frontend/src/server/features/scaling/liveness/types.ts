import { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export const LivenessTimeRange = v.enum(['30d', '90d', 'max'])
export type LivenessTimeRange = v.infer<typeof LivenessTimeRange>

export const LivenessDataPoint = v.object({
  averageInSeconds: v.number().check((v) => Number.isInteger(v) && v > 0),
  minimumInSeconds: v.number().check((v) => Number.isInteger(v) && v > 0),
  maximumInSeconds: v.number().check((v) => Number.isInteger(v) && v > 0),
})
export type LivenessDataPoint = v.infer<typeof LivenessDataPoint>

export const LivenessAnomaly = v.object({
  timestamp: v.number(),
  durationInSeconds: v.number().check((v) => Number.isInteger(v) && v > 0),
  type: TrackedTxsConfigSubtype,
})
export type LivenessAnomaly = v.infer<typeof LivenessAnomaly>

const LivenessDetails = v.object({
  '30d': LivenessDataPoint.optional(),
  '90d': LivenessDataPoint.optional(),
  max: LivenessDataPoint.optional(),
  syncedUntil: v.number(),
})

export type LivenessDetails = v.infer<typeof LivenessDetails>

export const LivenessProject = v.object({
  batchSubmissions: LivenessDetails.optional(),
  stateUpdates: LivenessDetails.optional(),
  proofSubmissions: LivenessDetails.optional(),
  anomalies: v.array(LivenessAnomaly),
})
export type LivenessProject = v.infer<typeof LivenessProject>

export const LivenessResponse = v.record(v.string(), LivenessProject)
export type LivenessResponse = v.infer<typeof LivenessResponse>
