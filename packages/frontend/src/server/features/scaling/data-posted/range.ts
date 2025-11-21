import { v } from '@l2beat/validate'

export const DataPostedTimeRange = v.tuple([
  v.union([v.number(), v.null()]),
  v.number(),
])
export type DataPostedTimeRange = v.infer<typeof DataPostedTimeRange>
