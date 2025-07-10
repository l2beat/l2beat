import { v } from '@l2beat/validate'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const TvsChartRange = v.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
export type TvsChartRange = v.infer<typeof TvsChartRange>

export type TvsChartResolution = ReturnType<typeof rangeToResolution>

export function rangeToResolution(
  range: { type: TvsChartRange } | { type: 'custom'; from: number; to: number },
) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
