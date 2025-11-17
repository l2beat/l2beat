import { v } from '@l2beat/validate'
import { rangeToDays } from '~/utils/range/rangeToDays'

export type TvsChartRange = v.infer<typeof TvsChartRange>
export const TvsChartRange = v.object({
  from: v.union([v.number(), v.null()]),
  to: v.number(),
})

export type TvsChartResolution = ReturnType<typeof rangeToResolution>

export function rangeToResolution(range: TvsChartRange) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
