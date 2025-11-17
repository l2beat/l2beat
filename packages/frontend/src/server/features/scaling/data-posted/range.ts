import { v } from '@l2beat/validate'

export const DataPostedTimeRange = v.object({
  from: v.union([v.number(), v.null()]),
  to: v.number(),
})
export type DataPostedTimeRange = v.infer<typeof DataPostedTimeRange>
