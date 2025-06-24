import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

export const GetMetricsSuccessSchema = z.object({
  throughput: z.number(),
})

const ProjectDataSchema = z.object({
  datetime: z
    .string()
    .transform((val) => UnixTime.fromDate(new Date(val + 'Z'))),
  customer_id: z.string(),
  total_size_mb: z.number(),
})
export const GetByProjectDataSuccessSchema = z.array(ProjectDataSchema)
