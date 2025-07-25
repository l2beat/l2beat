import { v } from '@l2beat/validate'

export const DataPostedTimeRange = v.union([
  v.literal('1d'),
  v.literal('7d'),
  v.literal('30d'),
  v.literal('90d'),
  v.literal('180d'),
  v.literal('1y'),
  v.literal('max'),
])
export type DataPostedTimeRange = v.infer<typeof DataPostedTimeRange>
