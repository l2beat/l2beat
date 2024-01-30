import { z } from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

const TokenTvlApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
])
export type TokenTvlApiChartPoint = z.infer<typeof TokenTvlApiChartPoint>

const TokenTvlApiChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.string(), z.string()]),
  data: z.array(TokenTvlApiChartPoint),
})
export type TokenTvlApiChart = z.infer<typeof TokenTvlApiChart>

export const TokenTvlApiCharts = z.object({
  hourly: TokenTvlApiChart,
  sixHourly: TokenTvlApiChart,
  daily: TokenTvlApiChart,
})
export type TokenTvlApiCharts = z.infer<typeof TokenTvlApiCharts>
