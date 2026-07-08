import type {
  TokenRelationPrimaryKey as DbTokenRelationPrimaryKey,
  TokenRelationRecord as DbTokenRelationRecord,
  TokenRelationUpdateable as DbTokenRelationUpdateable,
  JsonValue,
} from '@l2beat/database'
import { InteropBridgeTypeValues } from '@l2beat/shared-pure'
import { type Validator, v } from '@l2beat/validate'
import type { Equal, Expect } from '../utils/expectEqual'

const JsonValue: Validator<JsonValue> = v.lazy(() =>
  v.union([
    v.string(),
    v.number(),
    v.boolean(),
    v.null(),
    v.array(JsonValue),
    v.record(v.string(), JsonValue),
  ]),
)

type _ = Expect<Equal<TokenRelationRecord, DbTokenRelationRecord>>
export type TokenRelationRecord = v.infer<typeof TokenRelationRecord>
export const TokenRelationRecord = v.object({
  tokenFromChain: v.string(),
  tokenFromAddress: v.string(),
  tokenToChain: v.string(),
  tokenToAddress: v.string(),
  plugin: v.string(),
  sourceWasBurned: v.boolean(),
  destinationWasMinted: v.boolean(),
  bridgeType: v.union([v.enum(InteropBridgeTypeValues), v.null()]),
  transfer: JsonValue,
})

type __ = Expect<Equal<TokenRelationPrimaryKey, DbTokenRelationPrimaryKey>>
export type TokenRelationPrimaryKey = v.infer<typeof TokenRelationPrimaryKey>
export const TokenRelationPrimaryKey = v.object({
  tokenFromChain: v.string(),
  tokenFromAddress: v.string(),
  tokenToChain: v.string(),
  tokenToAddress: v.string(),
  plugin: v.string(),
  sourceWasBurned: v.boolean(),
  destinationWasMinted: v.boolean(),
})

type ___ = Expect<Equal<TokenRelationUpdateable, DbTokenRelationUpdateable>>
export type TokenRelationUpdateable = v.infer<typeof TokenRelationUpdateable>
export const TokenRelationUpdateable = v.object({
  bridgeType: v.union([v.enum(InteropBridgeTypeValues), v.null()]).optional(),
  transfer: JsonValue.optional(),
})
