import { v } from '@l2beat/validate'

export const ActivityResultItemSchema = v
  .object({
    timestamp: v.number(),
    txCount: v.number(),
    uopsCount: v.number(),
  })
  .describe('ActivityChartDataPoint')

export type ActivityResultItem = v.infer<typeof ActivityResultItemSchema>

export const ActivityResultSchema = v.array(ActivityResultItemSchema)

export const ActivityRangeSchema = v.enum(['30d', '90d', '180d', '1y', 'max'])
export type ActivityRange = v.infer<typeof ActivityRangeSchema>
