import z from 'zod'

const L2CostsDetails = z
  .object({
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
  })
  .or(z.undefined())
export type L2CostsDetails = z.infer<typeof L2CostsDetails>

export const L2CostsApiProject = z.object({
  '24h': L2CostsDetails,
  '7d': L2CostsDetails,
  '30d': L2CostsDetails,
  '90d': L2CostsDetails,
  isSynced: z.boolean(),
})

export type L2CostsApiProject = z.infer<typeof L2CostsApiProject>

export const L2CostsApiResponse = z.object({
  projects: z.record(z.string(), z.optional(L2CostsApiProject)),
})
export type L2CostsApiResponse = z.infer<typeof L2CostsApiResponse>
