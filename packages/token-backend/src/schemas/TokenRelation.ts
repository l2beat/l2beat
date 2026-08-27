import type {
  TokenRelationPrimaryKey as DbTokenRelationPrimaryKey,
  TokenRelationRecord as DbTokenRelationRecord,
  TokenRelationUpdateable as DbTokenRelationUpdateable,
  JsonValue,
} from '@l2beat/database'
import {
  InteropBridgeTypeValues,
  ManualRelationBridge,
} from '@l2beat/shared-pure'
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

/**
 * The manual-entry evidence a client submits inside
 * `AddTokenRelationIntent`/`UpdateTokenRelationIntent` for a relation whose
 * plugin is `MANUAL_RELATION_PLUGIN`. The planner validates this shape and
 * stamps the plan-time user on it, producing the stored
 * `ManualRelationEvidence` (in `@l2beat/shared-pure`) — the client never
 * supplies `user` itself.
 */
export type ManualRelationEvidenceInput = v.infer<
  typeof ManualRelationEvidenceInput
>
export const ManualRelationEvidenceInput = v.object({
  kind: v.literal('manual'),
  comment: v.union([v.string(), v.null()]),
  bridge: v.union([ManualRelationBridge, v.null()]),
})
