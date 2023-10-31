import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

const DataPoint = z.object({
  averageInSeconds: z.number().positive().int(),
  maximumInSeconds: z.number().positive().int(),
})

export const LivenessApiProject = z.object({
  batchSubmissions: z.object({
    last30Days: DataPoint,
    last90Days: DataPoint,
    max: DataPoint,
  }),
  stateUpdates: z.object({
    last30Days: DataPoint,
    last90Days: DataPoint,
    max: DataPoint,
  }),
  anomalies: z.array(
    z.object({
      timestamp: branded(z.number(), (n) => new UnixTime(n)),
      durationInSeconds: z.number().positive().int(),
    }),
  ),
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
          maximumInSeconds: 60 * 60 * 4,
        },
        last90Days: {
          averageInSeconds: 60 * 60 * 3,
          maximumInSeconds: 60 * 60 * 5,
        },
        max: {
          averageInSeconds: 60 * 60 * 3.5,
          maximumInSeconds: 60 * 60 * 5.2,
        },
      },
      stateUpdates: {
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
