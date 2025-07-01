import { v } from '@l2beat/validate'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const LivenessChartTimeRange = v.union([
  v.literal('7d'),
  v.literal('30d'),
  v.literal('90d'),
  v.literal('180d'),
  v.literal('1y'),
  v.literal('max'),
] as const)
export type LivenessChartTimeRange = v.infer<typeof LivenessChartTimeRange>

export function rangeToResolution(range: LivenessChartTimeRange) {
  const days = rangeToDays({ type: range })
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
