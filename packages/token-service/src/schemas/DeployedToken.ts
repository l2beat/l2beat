import type {
  DeployedTokenPrimaryKey as DbDeployedTokenPrimaryKey,
  DeployedTokenRecord as DbDeployedTokenRecord,
  DeployedTokenUpdateable as DbDeployedTokenUpdateable,
} from '@l2beat/database'
import { v } from '@l2beat/validate'
import type { Equal, Expect } from '../utils/expectEqual'

type _ = Expect<Equal<DeployedTokenRecord, DbDeployedTokenRecord>>
export type DeployedTokenRecord = v.infer<typeof DeployedTokenRecord>
export const DeployedTokenRecord = v.object({
  symbol: v.string(),
  comment: v.union([v.string(), v.null()]),
  chain: v.string(),
  address: v.string(),
  abstractTokenId: v.union([v.string(), v.null()]),
  decimals: v.number(),
  deploymentTimestamp: v.number(),
})

type __ = Expect<Equal<DeployedTokenUpdateable, DbDeployedTokenUpdateable>>
export type DeployedTokenUpdateable = v.infer<typeof DeployedTokenUpdateable>
export const DeployedTokenUpdateable = v.object({
  symbol: v.string().optional(),
  comment: v.union([v.string(), v.null()]).optional(),
  abstractTokenId: v.union([v.string(), v.null()]).optional(),
  decimals: v.number().optional(),
  deploymentTimestamp: v.number().optional(),
})

type ___ = Expect<Equal<DeployedTokenPrimaryKey, DbDeployedTokenPrimaryKey>>
export type DeployedTokenPrimaryKey = v.infer<typeof DeployedTokenPrimaryKey>
export const DeployedTokenPrimaryKey = v.object({
  chain: v.string(),
  address: v.string(),
})
