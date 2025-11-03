import { v } from '@l2beat/validate'

export const HourlyStatsResponse = v.object({
  data: v.object({
    chart: v.object({
      types: v.array(v.string()),
      data: v.array(
        v.tuple([
          v.number(), // timestamp
          v.number(), // count (transactions)
          v.number(), // uopsCount (user operations)
        ]),
      ),
    }),
  }),
})

export const LighterErrorResponse = v.object({
  error: v.string(),
})
