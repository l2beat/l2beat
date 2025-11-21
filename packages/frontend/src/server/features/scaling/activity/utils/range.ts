import { v } from '@l2beat/validate'

export type ActivityTimeRange = v.infer<typeof ActivityTimeRange>
export const ActivityTimeRange = v.tuple([
  v.union([v.number(), v.null()]),
  v.number(),
])
