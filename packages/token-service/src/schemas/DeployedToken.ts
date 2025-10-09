import { v } from '@l2beat/validate'

export type DeployedTokenRecordSchema = v.infer<
  typeof DeployedTokenRecordSchema
>
export const DeployedTokenRecordSchema = v.object({
  symbol: v.string(),
  comment: v.union([v.string(), v.null()]),
  chain: v.string(),
  address: v.string(),
  abstractTokenId: v.union([v.string(), v.null()]),
  decimals: v.number(),
  deploymentTimestamp: v.number(),
})

export type DeployedTokenUpdateableSchema = v.infer<
  typeof DeployedTokenUpdateableSchema
>
export const DeployedTokenUpdateableSchema = v.object({
  symbol: v.string().optional(),
  comment: v.union([v.string(), v.null()]).optional(),
  abstractTokenId: v.union([v.string(), v.null()]).optional(),
  decimals: v.number().optional(),
  deploymentTimestamp: v.number().optional(),
})

export type DeployedTokenPrimaryKeySchema = v.infer<
  typeof DeployedTokenPrimaryKeySchema
>
export const DeployedTokenPrimaryKeySchema = v.object({
  chain: v.string(),
  address: v.string(),
})
