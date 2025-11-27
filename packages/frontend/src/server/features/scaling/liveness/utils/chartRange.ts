import type { ChartRange, ChartResolution } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export function rangeToResolution(range: ChartRange): ChartResolution {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
