import { v } from '@l2beat/validate'

const Metadata = v.object({
  tvs: v
    .object({
      includeInCalculations: v.boolean(),
      source: v.enum(['canonical', 'external', 'native']),
      supply: v.enum(['totalSupply', 'circulatingSupply', 'zero']).optional(),
      bridgedUsing: v.array(
        v.object({ name: v.string(), slug: v.string().optional() }),
      ),
      excludeFromTotal: v.boolean(),
    })
    .optional(),
})

export type DeployedTokenRecord = v.infer<typeof DeployedTokenRecord>
export const DeployedTokenRecord = v.object({
  symbol: v.string(),
  comment: v.union([v.string(), v.null()]),
  chain: v.string(),
  address: v.string(),
  abstractTokenId: v.union([v.string(), v.null()]),
  decimals: v.number(),
  deploymentTimestamp: v.number(),
  metadata: v.union([Metadata, v.null()]),
})

export type DeployedTokenUpdateable = v.infer<typeof DeployedTokenUpdateable>
export const DeployedTokenUpdateable = v.object({
  symbol: v.string().optional(),
  comment: v.union([v.string(), v.null()]).optional(),
  abstractTokenId: v.union([v.string(), v.null()]).optional(),
  decimals: v.number().optional(),
  deploymentTimestamp: v.number().optional(),
  metadata: Metadata.optional(),
})

export type DeployedTokenPrimaryKey = v.infer<typeof DeployedTokenPrimaryKey>
export const DeployedTokenPrimaryKey = v.object({
  chain: v.string(),
  address: v.string(),
})
