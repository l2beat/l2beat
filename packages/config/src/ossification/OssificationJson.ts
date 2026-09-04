import { v } from '@l2beat/validate'

/** Onchain anchor of a reviewed event: the transaction that made the change.
 *  The lint re-derives every event timestamp from its receipt, so nothing
 *  less specific is accepted. */
const TX_SOURCE_RE = /^tx:0x[0-9a-f]{64}$/i

const CriticalEventSchema = v.strictObject({
  timestamp: v.number(),
  type: v.union([v.literal('code'), v.literal('state')]),
  /** `tx:<hash>` — auditable onchain evidence. */
  source: v
    .string()
    .check((source) => TX_SOURCE_RE.test(source), 'must be a tx:<hash> anchor'),
  /** One-sentence security consequence. */
  reason: v.string(),
  /** Discovery update whose mechanical events this entry supersedes for
   *  `contract` (and which receives the critical change tag). */
  updateId: v.string().optional(),
  /** Current or historical critical contract; omitted only for a
   *  mechanism change stored on an excluded actor shell (a Safe). */
  contract: v.string().optional(),
  /** Events on removed contracts feed the change rate, never the clock. */
  historical: v.boolean().optional(),
})

const HistoricalContractSchema = v.strictObject({
  address: v.string(),
  name: v.string(),
  /** Only `true` entries are consumed; reviewed non-critical ones are kept
   *  as evidence that the contract was considered. */
  critical: v.union([v.boolean(), v.null()]),
  /** Onchain upgrade transaction timestamps, the closed code-change ledger. */
  upgradeTimestamps: v.array(v.number()),
  /** Reviewer's justification. */
  note: v.string(),
  lastSeenAt: v.number().optional(),
  lastSeenCommit: v.string().optional(),
  diffEventCount: v.number().optional(),
})

/** Committed judgment file — the opt-in marker for the ossification factor.
 *  `{}` is a complete file: everything else is evidence discovery cannot
 *  reconstruct mechanically. */
export const OssificationJsonSchema = v.strictObject({
  /** Discovery projects whose critical contracts and change history count as
   *  part of this project's perimeter (tightly integrated shared modules). */
  includeProjects: v.array(v.string()).optional(),
  /** Contracts whose first recognized upgrade event changed an implementation
   *  that was already initialized. */
  firstUpgradeIsChange: v.array(v.string()).optional(),
  /** Audited initialization/no-op upgrade transactions, keyed by contract. */
  ignoredUpgradeTransactions: v
    .record(v.string(), v.array(v.string()))
    .optional(),
  /** Reviewed events missing from mechanical discovery history. */
  criticalEvents: v.array(CriticalEventSchema).optional(),
  /** "<chain:address>#<field>" acknowledgments: a reviewer confirmed the
   *  field's HIGH-severity removal, so its silenced history needs no
   *  backfill. Consumed by the lint audit only, never by the runtime. */
  reviewedSeverityDowngrades: v.array(v.string()).optional(),
  /** Contracts that once were critical but have left the current perimeter. */
  historicalContracts: v.array(HistoricalContractSchema).optional(),
})

export type OssificationJson = v.infer<typeof OssificationJsonSchema>
