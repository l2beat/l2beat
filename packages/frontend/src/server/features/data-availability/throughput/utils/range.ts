import type { ChartRange, ChartResolution } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const DaThroughputTimeRangeValues = [
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
] as const

export type DaThroughputResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(range: ChartRange): ChartResolution {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days <= 180) return 'sixHourly'
  return 'daily'
}
