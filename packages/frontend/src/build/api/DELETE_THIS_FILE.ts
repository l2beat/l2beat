import { branded, UnixTime } from '@l2beat/shared-pure'
import z from 'zod'

const L2CostsDetails = z.object({
  total: z.object({
    ethCost: z.number(),
    usdCost: z.number(),
    gas: z.number(),
  }),
  calldata: z.object({
    ethCost: z.number(),
    usdCost: z.number(),
    gas: z.number(),
  }),
  blobs: z
    .object({
      ethCost: z.number(),
      usdCost: z.number(),
      gas: z.number(),
    })
    .optional(),
  compute: z.object({
    ethCost: z.number(),
    usdCost: z.number(),
    gas: z.number(),
  }),
  overhead: z.object({
    ethCost: z.number(),
    usdCost: z.number(),
    gas: z.number(),
  }),
})
export type L2CostsDetails = z.infer<typeof L2CostsDetails>

export const L2CostsApiProject = z.object({
  last24h: L2CostsDetails,
  last7d: L2CostsDetails,
  last30d: L2CostsDetails,
  last90d: L2CostsDetails,
  // daily: [L2CostsDetails],
  // hourly: [L2CostsDetails],
  syncedUntil: branded(z.number(), (n) => new UnixTime(n)),
})
export type L2CostsApiProject = z.infer<typeof L2CostsApiProject>

export const L2CostsApiResponse = z.object({
  projects: z.record(z.string(), z.optional(L2CostsApiProject)),
})
export type L2CostsApiResponse = z.infer<typeof L2CostsApiResponse>
