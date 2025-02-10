import { z } from 'zod'

export type DaThroughputTimeRange = z.infer<typeof DaThroughputTimeRange>
export const DaThroughputTimeRange = z.enum(['30d', '90d', '180d', 'max'])
