import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

const L2CostsDetails = z.object({
  totalCost: z.number(),
  totalGas: z.number(),
  totalCostUsd: z.number(),
  totalCalldataGas: z.number(),
  totalComputeGas: z.number(),
  totalBlobGas: z.number().optional(),
  totalCalldataCost: z.number(),
  totalComputeCost: z.number(),
  totalBlobCost: z.number().optional(),
  totalCalldataCostUsd: z.number(),
  totalComputeCostUsd: z.number(),
  totalBlobCostUsd: z.number().optional(),
  totalOverheadGas: z.number(),
  totalOverheadCost: z.number(),
  totalOverheadCostUsd: z.number(),
})
export type L2CostsDetails = z.infer<typeof L2CostsDetails>

export const L2CostsApiProject = z.object({
  last24h: L2CostsDetails.or(z.undefined()),
  last7d: L2CostsDetails.or(z.undefined()),
  last30d: L2CostsDetails.or(z.undefined()),
  last90d: L2CostsDetails.or(z.undefined()),
  // daily: [L2CostsDetails],
  // hourly: [L2CostsDetails],
  syncedUntil: branded(z.number(), (n) => new UnixTime(n)),
})

export type L2CostsApiProject = z.infer<typeof L2CostsApiProject>

export const L2CostsApiResponse = z.object({
  projects: z.record(z.string(), z.optional(L2CostsApiProject)),
})
export type L2CostsApiResponse = z.infer<typeof L2CostsApiResponse>
