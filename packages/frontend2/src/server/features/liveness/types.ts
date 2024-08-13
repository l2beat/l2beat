import { TrackedTxsConfigSubtype, UnixTime, branded } from '@l2beat/shared-pure'
import z from 'zod'

export const LivenessTimeRange = z.enum(['30d', '90d', 'max'])
export type LivenessTimeRange = z.infer<typeof LivenessTimeRange>

export const LivenessDataPoint = z
  .object({
    averageInSeconds: z.number().positive().int(),
    minimumInSeconds: z.number().positive().int(),
    maximumInSeconds: z.number().positive().int(),
  })
  .or(z.undefined())
export type LivenessDataPoint = z.infer<typeof LivenessDataPoint>

export const LivenessAnomaly = z.object({
  timestamp: branded(z.number(), (n) => new UnixTime(n)),
  durationInSeconds: z.number().positive().int(),
  type: TrackedTxsConfigSubtype,
})
export type LivenessAnomaly = z.infer<typeof LivenessAnomaly>

const LivenessDetails = z
  .object({
    [LivenessTimeRange.Enum['30d']]: LivenessDataPoint,
    [LivenessTimeRange.Enum['90d']]: LivenessDataPoint,
    [LivenessTimeRange.Enum.max]: LivenessDataPoint,
    syncedUntil: branded(z.number(), (n) => new UnixTime(n)),
  })
  .or(z.undefined())
export type LivenessDetails = z.infer<typeof LivenessDetails>

export const LivenessProject = z.object({
  batchSubmissions: LivenessDetails,
  stateUpdates: LivenessDetails,
  proofSubmissions: LivenessDetails,
  anomalies: z.array(LivenessAnomaly).or(z.undefined()),
})
export type LivenessProject = z.infer<typeof LivenessProject>

export const LivenessResponse = z.record(
  z.string(),
  z.optional(LivenessProject),
)
export type LivenessResponse = z.infer<typeof LivenessResponse>
