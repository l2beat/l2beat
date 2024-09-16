import { z } from 'zod'

export type ActivityTimeRange = z.infer<typeof ActivityTimeRange>
export const ActivityTimeRange = z.enum(['30d', '90d', '180d', '1y', 'max'])
