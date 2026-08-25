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

/**
 * The bridge a manually added relation claims as its mechanism, e.g. the WETH
 * contract for the ETH <-> WETH pair. Display-only, like all relation
 * evidence: no read path derives roles or identity from it.
 */
export type ManualRelationBridge = v.infer<typeof ManualRelationBridge>
export const ManualRelationBridge = v.object({
  name: v.string(),
  chain: v.union([v.string(), v.null()]),
  address: v.union([v.string(), v.null()]),
})

/**
 * The manual-entry evidence a client submits inside
 * `AddTokenRelationIntent`/`UpdateTokenRelationIntent` for a relation whose
 * plugin is `MANUAL_RELATION_PLUGIN`. The planner validates this shape and
 * stamps the plan-time user on it, producing `ManualRelationEvidence` — the
 * client never supplies `user` itself.
 *
 * Nullable rather than optional fields: the object is stored verbatim as the
 * relation's `transfer` evidence JSON, and JSON has null, not undefined.
 */
export type ManualRelationEvidenceInput = v.infer<
  typeof ManualRelationEvidenceInput
>
export const ManualRelationEvidenceInput = v.object({
  kind: v.literal('manual'),
  comment: v.union([v.string(), v.null()]),
  bridge: v.union([ManualRelationBridge, v.null()]),
})

/**
 * What the `transfer` evidence column holds for a manually added relation —
 * a human attestation instead of a sample interop transfer. The `kind`
 * discriminator tells the two evidence shapes apart inside the JSON; the
 * row-level `plugin = 'manual'` sentinel tells them apart without opening it.
 * See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
 */
export type ManualRelationEvidence = v.infer<typeof ManualRelationEvidence>
export const ManualRelationEvidence = v.object({
  kind: v.literal('manual'),
  user: v.string(),
  comment: v.union([v.string(), v.null()]),
  bridge: v.union([ManualRelationBridge, v.null()]),
})
