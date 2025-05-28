import { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import z from 'zod'

export const LivenessTimeRange = z.enum(['30d', '90d', 'max'])
export type LivenessTimeRange = z.infer<typeof LivenessTimeRange>

export const LivenessDataPoint = z.object({
  averageInSeconds: z.number().positive().int(),
  minimumInSeconds: z.number().positive().int(),
  maximumInSeconds: z.number().positive().int(),
})
export type LivenessDataPoint = z.infer<typeof LivenessDataPoint>

export const LivenessAnomaly = z.object({
  timestamp: z.number(),
  durationInSeconds: z.number().positive().int(),
  type: TrackedTxsConfigSubtype,
})
export type LivenessAnomaly = z.infer<typeof LivenessAnomaly>

const LivenessDetails = z
  .record(LivenessTimeRange, LivenessDataPoint.optional())
  .and(
    z.object({
      syncedUntil: z.number(),
    }),
  )

export type LivenessDetails = z.infer<typeof LivenessDetails>

export const LivenessProject = z.object({
  batchSubmissions: LivenessDetails.optional(),
  stateUpdates: LivenessDetails.optional(),
  proofSubmissions: LivenessDetails.optional(),
  anomalies: z.array(LivenessAnomaly),
})
export type LivenessProject = z.infer<typeof LivenessProject>

export const LivenessResponse = z.record(z.string(), LivenessProject)
export type LivenessResponse = z.infer<typeof LivenessResponse>
