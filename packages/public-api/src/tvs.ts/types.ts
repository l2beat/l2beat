import { v } from '@l2beat/validate'

export const TvsResultItemSchema = v
  .object({
    timestamp: v.number(),
    totalTvs: v.number(),
    bySource: v.object({
      native: v.number(),
      canonical: v.number(),
      external: v.number(),
    }),
    byCategory: v.object({
      stablecoins: v.number(),
      eth: v.number(),
      btc: v.number(),
      other: v.number(),
    }),
  })
  .describe('Tvs')

export type TvsResultItem = v.infer<typeof TvsResultItemSchema>
export const TvsResultSchema = v.array(TvsResultItemSchema)

export const TvsRangeSchema = v.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
export type TvsRange = v.infer<typeof TvsRangeSchema>

export type TvsResolution = ReturnType<typeof rangeToResolution>

export function rangeToResolution(range: TvsRange) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}

export function rangeToDays(range: TvsRange) {
  if (range === 'max') return null
  const count = Number.parseInt(range.substring(0, range.length - 1))
  const unit = range.substring(range.length - 1)

  if (unit === 'd') {
    return count
  }

  if (unit === 'y') {
    return count * 365
  }

  throw new Error('Invalid range')
}
