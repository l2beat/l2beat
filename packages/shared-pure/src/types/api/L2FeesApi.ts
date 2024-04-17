import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

const L2FeesApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
])
export type L2FeesApiChartPoint = z.infer<typeof L2FeesApiChartPoint>

const L2FeesApiChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('gasPriceUsd'),
    z.literal('gasPriceEth'),
  ]),
  data: z.array(L2FeesApiChartPoint),
})
export type L2FeesApiChart = z.infer<typeof L2FeesApiChart>

export const L2FeesApiResponse = z.object({
  projects: z.record(z.string(), z.optional(L2FeesApiChart)),
})
export type L2FeesApiResponse = z.infer<typeof L2FeesApiResponse>
