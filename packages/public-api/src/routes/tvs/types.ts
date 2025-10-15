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
  .describe('TvsChartDataPoint')

export type TvsResultItem = v.infer<typeof TvsResultItemSchema>
export const TvsResultSchema = v.array(TvsResultItemSchema)

export const TvsRangeSchema = v.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
export type TvsRange = v.infer<typeof TvsRangeSchema>
