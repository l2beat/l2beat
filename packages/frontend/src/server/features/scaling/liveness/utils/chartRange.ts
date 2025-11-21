import type { ChartRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export type LivenessChartResolution = 'hourly' | 'sixHourly' | 'daily'
export function rangeToResolution(
  range: ChartRange,
): LivenessChartResolution {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
