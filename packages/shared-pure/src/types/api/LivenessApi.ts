import z from 'zod'

import { branded } from '../branded'
import { LivenessType } from '../LivenessType'
import { UnixTime } from '../UnixTime'

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
  type: branded(z.string(), (t) => LivenessType(t)),
})
export type LivenessAnomaly = z.infer<typeof LivenessAnomaly>

const LivenessDetails = z
  .object({
    last30Days: LivenessDataPoint,
    last90Days: LivenessDataPoint,
    allTime: LivenessDataPoint,
  })
  .or(z.undefined())
export type LivenessDetails = z.infer<typeof LivenessDetails>

export const LivenessApiProject = z.object({
  batchSubmissions: LivenessDetails,
  stateUpdates: LivenessDetails,
  proofSubmissions: LivenessDetails,
  anomalies: z.array(LivenessAnomaly).or(z.undefined()),
})
export type LivenessApiProject = z.infer<typeof LivenessApiProject>

export const LivenessApiResponse = z.object({
  projects: z.record(z.string(), z.optional(LivenessApiProject)),
})
export type LivenessApiResponse = z.infer<typeof LivenessApiResponse>

/**
const example: LivenessApiResponse = {
  projects: {
    arbitrum: {
      batchSubmissions: {
        last30Days: {
          averageInSeconds: 60 * 60 * 2,
          minimumInSeconds: 60 * 60 * 1,
          maximumInSeconds: 60 * 60 * 4,
        },
        last90Days: {
          averageInSeconds: 60 * 60 * 3,
          minimumInSeconds: 60 * 60 * 0.5,
          maximumInSeconds: 60 * 60 * 5,
        },
        max: {
          averageInSeconds: 60 * 60 * 3.5,
          minimumInSeconds: 60 * 60 * 0.2,
          maximumInSeconds: 60 * 60 * 5.2,
        },
      },
      stateUpdates: {
        last30Days: {
          averageInSeconds: 60 * 60 * 22,
          minimumInSeconds: 60 * 60 * 11,
          maximumInSeconds: 60 * 60 * 44,
        },
        last90Days: {
          averageInSeconds: 60 * 60 * 33,
          minimumInSeconds: 60 * 60 * 06,
          maximumInSeconds: 60 * 60 * 55,
        },
        max: {
          averageInSeconds: 60 * 60 * 33.5,
          minimumInSeconds: 60 * 60 * 04.2,
          maximumInSeconds: 60 * 60 * 55.2,
        },
      },
      proofSubmissions: {
        last30Days: {
          averageInSeconds: 60 * 60 * 22,
          maximumInSeconds: 60 * 60 * 44,
        },
        last90Days: {
          averageInSeconds: 60 * 60 * 33,
          maximumInSeconds: 60 * 60 * 55,
        },
        max: {
          averageInSeconds: 60 * 60 * 33.5,
          maximumInSeconds: 60 * 60 * 55.2,
        },
      },
      anomalies: [
        {
          timestamp: UnixTime.fromDate(new Date('2023-10-131T12:35:47Z')),
          durationInSeconds: 60 * 60 * 2,
        },
      ],
    },
  },
}
*/
