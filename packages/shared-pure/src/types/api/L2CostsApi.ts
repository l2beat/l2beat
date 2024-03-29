import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

const L2CostsApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number().nullable(),
  z.number().nullable(),
  z.number().nullable(),
])
export type L2CostsApiChartPoint = z.infer<typeof L2CostsApiChartPoint>

const L2CostsApiChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('totalGas'),
    z.literal('totalEth'),
    z.literal('totalUsd'),
    z.literal('overheadGas'),
    z.literal('overheadEth'),
    z.literal('overheadUsd'),
    z.literal('calldataGas'),
    z.literal('calldataEth'),
    z.literal('calldataUsd'),
    z.literal('computeGas'),
    z.literal('computeEth'),
    z.literal('computeUsd'),
    z.literal('blobsGas'),
    z.literal('blobsEth'),
    z.literal('blobsUsd'),
  ]),
  data: z.array(L2CostsApiChartPoint),
})
export type L2CostsApiChart = z.infer<typeof L2CostsApiChart>

export const L2CostsApiCharts = z.object({
  hourly: L2CostsApiChart,
  daily: L2CostsApiChart,
  syncedUntil: branded(z.number(), (n) => new UnixTime(n)),
})
export type L2CostsApiCharts = z.infer<typeof L2CostsApiCharts>

export const L2CostsApiResponse = z.object({
  combined: L2CostsApiCharts,
  projects: z.record(z.string(), z.optional(L2CostsApiCharts)),
})
export type L2CostsApiResponse = z.infer<typeof L2CostsApiResponse>
