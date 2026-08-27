import { v } from '@l2beat/validate'

/**
 * The `plugin` value of a manually added `TokenRelation`.
 *
 * Interop plugins are observers — kebab-case identifiers declared by plugin
 * classes in the backend — and a relation's `plugin` column names the observer
 * whose transfer evidence produced it. A relation a human added through
 * token-UI has no such observer, so it carries this sentinel instead. Never
 * name a real interop plugin `manual`.
 *
 * The sentinel is a row-level marker: any reader can select or exclude manual
 * relations on the `plugin` column alone, without opening the `transfer`
 * evidence JSON (which for manual relations holds a `ManualRelationEvidence`
 * object rather than a sample interop transfer).
 * See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
 */
export const MANUAL_RELATION_PLUGIN = 'manual'

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
 * What the `transfer` evidence column holds for a relation whose plugin is
 * `MANUAL_RELATION_PLUGIN` — a human attestation instead of a sample interop
 * transfer. The planner writes this shape (stamping `user` itself; clients
 * submit the evidence without it) and the token-UI graph panel parses it back
 * for display.
 *
 * Nullable rather than optional fields: the object is stored verbatim as the
 * relation's `transfer` evidence JSON, and JSON has null, not undefined.
 */
export type ManualRelationEvidence = v.infer<typeof ManualRelationEvidence>
export const ManualRelationEvidence = v.object({
  kind: v.literal('manual'),
  user: v.string(),
  comment: v.union([v.string(), v.null()]),
  bridge: v.union([ManualRelationBridge, v.null()]),
})
