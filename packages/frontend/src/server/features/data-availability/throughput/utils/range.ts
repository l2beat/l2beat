import { z } from 'zod'
import { rangeToDays } from '~/utils/range/rangeToDays'

export type DaThroughputTimeRange = z.infer<typeof DaThroughputTimeRange>
export const DaThroughputTimeRange = z.enum([
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
])

export function rangeToResolution(range: DaThroughputTimeRange) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
