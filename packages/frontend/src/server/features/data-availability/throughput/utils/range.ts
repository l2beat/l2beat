import { z } from 'zod/v4'

export type DaThroughputTimeRange = z.infer<typeof DaThroughputTimeRange>
export const DaThroughputTimeRange = z.enum(['30d', '90d', '180d', '1y', 'max'])
