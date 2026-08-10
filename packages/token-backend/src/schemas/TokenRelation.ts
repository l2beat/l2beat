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

const TokenRelationLockedToken = v.union([
  v.literal('A'),
  v.literal('B'),
  v.null(),
])

type _ = Expect<Equal<TokenRelationRecord, DbTokenRelationRecord>>
export type TokenRelationRecord = v.infer<typeof TokenRelationRecord>
export const TokenRelationRecord = v.object({
  tokenAChain: v.string(),
  tokenAAddress: v.string(),
  tokenBChain: v.string(),
  tokenBAddress: v.string(),
  plugin: v.string(),
  bridgeType: v.enum(InteropBridgeTypeValues),
  lockedToken: TokenRelationLockedToken,
  transfer: JsonValue,
})

type __ = Expect<Equal<TokenRelationPrimaryKey, DbTokenRelationPrimaryKey>>
export type TokenRelationPrimaryKey = v.infer<typeof TokenRelationPrimaryKey>
export const TokenRelationPrimaryKey = v.object({
  tokenAChain: v.string(),
  tokenAAddress: v.string(),
  tokenBChain: v.string(),
  tokenBAddress: v.string(),
  plugin: v.string(),
  bridgeType: v.enum(InteropBridgeTypeValues),
})

type ___ = Expect<Equal<TokenRelationUpdateable, DbTokenRelationUpdateable>>
export type TokenRelationUpdateable = v.infer<typeof TokenRelationUpdateable>
export const TokenRelationUpdateable = v.object({
  lockedToken: TokenRelationLockedToken.optional(),
  transfer: JsonValue.optional(),
})
