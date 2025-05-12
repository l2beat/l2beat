import { z } from 'zod'

export const LivenessChartTimeRange = z.union([
  z.literal('7d'),
  z.literal('30d'),
  z.literal('90d'),
  z.literal('180d'),
  z.literal('1y'),
  z.literal('max'),
])
export type LivenessChartTimeRange = z.infer<typeof LivenessChartTimeRange>
