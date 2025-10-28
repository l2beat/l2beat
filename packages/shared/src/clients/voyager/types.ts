import { v } from '@l2beat/validate'

export const DailyUopsResponse = v.object({
  items: v.array(
    v.object({
      date: v.string(),
      value: v.string().transform((value) => Number(value)),
    }),
  ),
})

export const DailyTxsResponse = v.object({
  items: v.array(
    v.object({
      date: v.string(),
      value: v.number(),
    }),
  ),
})

export const VoyagerErrorResponse = v.object({
  message: v.string(),
})
