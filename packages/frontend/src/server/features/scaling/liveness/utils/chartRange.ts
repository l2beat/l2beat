import { v } from '@l2beat/validate'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const LivenessChartTimeRange = v.object({
  from: v.union([v.number(), v.null()]),
  to: v.number(),
})
export type LivenessChartTimeRange = v.infer<typeof LivenessChartTimeRange>

export type LivenessChartResolution = 'hourly' | 'sixHourly' | 'daily'
export function rangeToResolution(
  range: LivenessChartTimeRange,
): LivenessChartResolution {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
