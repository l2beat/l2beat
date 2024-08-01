import { z } from 'zod'
import { rangeToDays } from '~/utils/range/range-to-days'

export const CostsTimeRange = z.union([
  z.literal('1d'),
  z.literal('7d'),
  z.literal('30d'),
  z.literal('90d'),
  z.literal('180d'),
])
export type CostsTimeRange = z.infer<typeof CostsTimeRange>

export function rangeToResolution(value: CostsTimeRange) {
  const days = rangeToDays(value)
  if (days < 30) {
    return 'hourly'
  }

  return 'daily'
}
