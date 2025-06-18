import { v } from '@l2beat/validate'

export const FinalityDataPoint = v.object({
  minimumInSeconds: v
    .number()
    .check((v) => Number.isInteger(v) && v >= 0)
    .optional(),
  averageInSeconds: v.number().check((v) => Number.isInteger(v) && v >= 0),
  maximumInSeconds: v.number().check((v) => Number.isInteger(v) && v >= 0),
})
export type FinalityDataPoint = v.infer<typeof FinalityDataPoint>

export const FinalityProjectData = v.object({
  timeToInclusion: FinalityDataPoint,
  stateUpdateDelays: v.union([
    v.object({
      averageInSeconds: v.number().check((v) => Number.isInteger(v) && v >= 0),
    }),
    v.null(),
  ]),
  syncedUntil: v.number(),
})
export type FinalityProjectData = v.infer<typeof FinalityProjectData>

export const FinalityData = v.record(v.string(), FinalityProjectData.optional())
export type FinalityData = v.infer<typeof FinalityData>
