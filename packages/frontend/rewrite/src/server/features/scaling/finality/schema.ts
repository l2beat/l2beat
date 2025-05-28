import z from 'zod'

export const FinalityDataPoint = z.object({
  minimumInSeconds: z.number().nonnegative().int().optional(),
  averageInSeconds: z.number().nonnegative().int(),
  maximumInSeconds: z.number().nonnegative().int(),
})
export type FinalityDataPoint = z.infer<typeof FinalityDataPoint>

export const FinalityProjectData = z.object({
  timeToInclusion: FinalityDataPoint,
  stateUpdateDelays: z
    .object({
      averageInSeconds: z.number().nonnegative().int(),
    })
    .nullable(),
  syncedUntil: z.number(),
})
export type FinalityProjectData = z.infer<typeof FinalityProjectData>

export const FinalityData = z.record(
  z.string(),
  z.optional(FinalityProjectData),
)
export type FinalityData = z.infer<typeof FinalityData>
