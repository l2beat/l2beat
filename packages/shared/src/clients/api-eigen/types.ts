import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export const GetMetricsSuccessSchema = v.object({
  throughput: v.number(),
})

const ProjectDataSchema = v.object({
  datetime: v
    .string()
    .transform((val) => UnixTime.fromDate(new Date(val + 'Z'))),
  customer_id: v.string(),
  total_size_mb: v.number(),
})
export const GetByProjectDataSuccessSchema = v.array(ProjectDataSchema)
