import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

export const FinalityDataPoint = z.object({
  minimumInSeconds: z.number().positive().int().optional(),
  averageInSeconds: z.number().positive().int(),
  maximumInSeconds: z.number().positive().int(),
})
export type FinalityDataPoint = z.infer<typeof FinalityDataPoint>

export const FinalityProjectData = z.object({
  timeToInclusion: FinalityDataPoint,
  syncedUntil: branded(z.number(), (n) => new UnixTime(n)),
})
export type FinalityProjectData = z.infer<typeof FinalityProjectData>

export const FinalityApiResponse = z.object({
  projects: z.record(z.string(), z.optional(FinalityProjectData)),
})
export type FinalityApiResponse = z.infer<typeof FinalityApiResponse>

/**
const example: FinalityApiResponse = {
  projects: {
    arbitrum: {
      timeToInclusion: {
        minimumInSeconds: 60 * 60 * 2,
        averageInSeconds: 60 * 60 * 2,
        maximumInSeconds: 60 * 60 * 4,
      }
    },
  },
}
*/
