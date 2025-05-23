import { z } from 'zod/v4'
import { rangeToDays } from '~/utils/range/range-to-days'

export const LivenessChartTimeRange = z.union([
  z.literal('7d'),
  z.literal('30d'),
  z.literal('90d'),
  z.literal('180d'),
  z.literal('1y'),
  z.literal('max'),
])
export type LivenessChartTimeRange = z.infer<typeof LivenessChartTimeRange>

export function rangeToResolution(range: LivenessChartTimeRange) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
