import { v } from '@l2beat/validate'

export type ActivityTimeRange = v.infer<typeof ActivityTimeRange>
export const ActivityTimeRange = v.enum(['30d', '90d', '180d', '1y', 'max'])
