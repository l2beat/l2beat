import { v } from '@l2beat/validate'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const DaThroughputTimeRangeValues = [
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
] as const
export type DaThroughputTimeRange = v.infer<typeof DaThroughputTimeRange>
export const DaThroughputTimeRange = v.enum(DaThroughputTimeRangeValues)

export function rangeToResolution(
  range:
    | { type: DaThroughputTimeRange | CostsTimeRange }
    | { type: 'custom'; from: number; to: number },
) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
