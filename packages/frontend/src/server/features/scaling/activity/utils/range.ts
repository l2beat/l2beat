import { v } from '@l2beat/validate'

export type ActivityTimeRange = v.infer<typeof ActivityTimeRange>
export const ActivityTimeRange = v.object({
  from: v.union([v.number(), v.null()]),
  to: v.number(),
})
