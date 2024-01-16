import z from 'zod'

export const FinalityDataPoint = z.object({
  averageInSeconds: z.number().positive().int(),
  minimumInSeconds: z.number().positive().int(),
  maximumInSeconds: z.number().positive().int(),
})
export type FinalityDataPoint = z.infer<typeof FinalityDataPoint>

export const FinalityApiResponse = z.object({
  projects: z.record(z.string(), z.optional(FinalityDataPoint)),
})
export type FinalityApiResponse = z.infer<typeof FinalityApiResponse>

/**
const example: FinalityApiResponse = {
  projects: {
    arbitrum: {
          averageInSeconds: 60 * 60 * 2,
          minimumInSeconds: 60 * 60 * 1,
          maximumInSeconds: 60 * 60 * 4,
      },
    },
  },
}
*/
