import { z } from 'zod'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
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

export function rangeToResolution(
  range: DaThroughputTimeRange | CostsTimeRange,
) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
