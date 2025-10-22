import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export const GetMetricsV1SuccessSchema = v.object({
  throughput: v.number(),
})

export const GetMetricsV2SuccessSchema = v.object({
  total_bytes_posted: v.number(),
})

const ProjectDataSchema = v.object({
  datetime: v
    .string()
    .transform((val) => UnixTime.fromDate(new Date(val + 'Z'))),
  customer_id: v.string(),
  total_size_mb: v.number(),
})
export const GetByProjectDataSuccessSchema = v.array(ProjectDataSchema)
