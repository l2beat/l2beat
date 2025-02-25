import { z } from 'zod'

export type DaThroughputTimeRange = z.infer<typeof DaThroughputTimeRange>
export const DaThroughputTimeRange = z.enum([
  '1d',
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
])
