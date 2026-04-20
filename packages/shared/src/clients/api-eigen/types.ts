import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export const GetMetricsResponse = v.object({
  total_bytes_posted: v.number(),
})
export type GetMetricsResponse = v.infer<typeof GetMetricsResponse>

const ProjectData = v.object({
  datetime: v
    .string()
    .transform((val) => UnixTime.fromDate(new Date(val + 'Z'))),
  customer_id: v.string(),
  total_size_mb: v.number(),
})
export const GetByProjectResponse = v.array(ProjectData)
export type GetByProjectResponse = v.infer<typeof GetByProjectResponse>
