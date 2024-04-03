import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

const L2CostsBreakdown = z.object({
  gas: z.number(),
  ethCost: z.number(),
  usdCost: z.number(),
})
export type L2CostsBreakdown = z.infer<typeof L2CostsBreakdown>

const L2CostsDetails = z.object({
  total: L2CostsBreakdown,
  overhead: L2CostsBreakdown,
  calldata: L2CostsBreakdown,
  compute: L2CostsBreakdown,
  blobs: L2CostsBreakdown.or(z.undefined()),
})
export type L2CostsDetails = z.infer<typeof L2CostsDetails>

export const L2CostsApiProject = z.object({
  last24h: L2CostsDetails,
  last7d: L2CostsDetails,
  last30d: L2CostsDetails,
  last90d: L2CostsDetails,
  syncedUntil: branded(z.number(), (n) => new UnixTime(n)),
})

export type L2CostsApiProject = z.infer<typeof L2CostsApiProject>

export const L2CostsApiResponse = z.object({
  projects: z.record(z.string(), z.optional(L2CostsApiProject)),
})
export type L2CostsApiResponse = z.infer<typeof L2CostsApiResponse>
