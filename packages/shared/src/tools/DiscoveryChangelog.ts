/**
 * changelog.json: the structured record of a project's watched discovery
 * changes, one entry per diffHistory.md entry that carried any. l2b writes each
 * entry straight from the DiscoveryDiff it just computed (see
 * packages/l2b .../discovery/changelog), so the file never depends on parsing
 * the markdown it sits next to. Entry identity is shared with the markdown
 * through `getDiffHistoryEntryId`, derived from header facts only.
 *
 * Entries record what was observed, never what it means: raw values, the
 * severity in force at run time, created/deleted status. Consumers apply
 * current judgment on top (the ossification runtime, for instance, evaluates
 * fields against today's fieldMeta severity, not the recorded one).
 */
import type { ChainPoint } from './DiffHistoryParser'
import { hashJson } from './hashJson'

export interface DiscoveryChangelog {
  formatVersion: 1
  /** Newest first, matching diffHistory.md order. */
  entries: DiscoveryChangelogEntry[]
}

export interface DiscoveryChangelogEntry {
  /** Stable update id, shared with the diffHistory.md entry and update cards:
   *  derived from the entry date and chain point only, so later description
   *  edits never orphan references (e.g. criticalEvents updateId). */
  id: string
  /** Discovery-run timestamp; falls back to the entry date for legacy
   *  block-numbered entries, null when neither parses. */
  timestamp: number | null
  changes: DiscoveryChangelogContract[]
}

export interface DiscoveryChangelogContract {
  /** Lowercased address (chain-prefixed for modern entries, bare for legacy
   *  ones migrated from old markdown). */
  address: string
  status?: 'created' | 'deleted'
  fields?: DiscoveryChangelogField[]
}

export type DiscoveryChangelogSeverity = 'HIGH' | 'MEDIUM' | 'LOW'

export interface DiscoveryChangelogField {
  /** Diff path exactly as produced by discovery, prefix included, e.g.
   *  "values.latestVerifier.9.verifier" or (legacy) "upgradeability.admin". */
  key: string
  removed?: string[]
  added?: string[]
  /** Severity the field carried when the change was recorded. Informational:
   *  a frozen snapshot of the judgment at the time, useful for auditing later
   *  re-classifications. */
  severity?: DiscoveryChangelogSeverity
}

/** Stable identity of a diffHistory.md entry. Inputs are exactly the fields
 *  fixed mechanically at generation time — never human-edited content. The
 *  ordinal disambiguates the rare entries in one file that share a date and
 *  chain point (use `createDiffHistoryEntryIdFactory` when processing a whole
 *  file). */
export function getDiffHistoryEntryId(
  date: string,
  current: ChainPoint | null,
  ordinal = 0,
): string {
  const key = hashJson([date, current?.kind ?? null, current?.value ?? null])
  return (ordinal === 0 ? key : hashJson([key, ordinal])).slice(2, 10)
}

/** Assigns ids to a file's entries in file order, disambiguating date/chain
 *  point collisions by occurrence. Every consumer of one diffHistory.md must
 *  feed ALL parsed entries through the same factory (before any filtering)
 *  so ordinals agree across consumers. */
export function createDiffHistoryEntryIdFactory(): (
  date: string,
  current: ChainPoint | null,
) => string {
  const seen = new Map<string, number>()
  return (date, current) => {
    const key = hashJson([date, current?.kind ?? null, current?.value ?? null])
    const ordinal = seen.get(key) ?? 0
    seen.set(key, ordinal + 1)
    return getDiffHistoryEntryId(date, current, ordinal)
  }
}

export function getDiffHistoryEntryTimestamp(
  date: string,
  current: ChainPoint | null,
): number | null {
  if (current?.kind === 'timestamp') {
    return current.value
  }
  const timestamp = Date.parse(date)
  return Number.isFinite(timestamp) ? Math.floor(timestamp / 1000) : null
}

export function serializeDiscoveryChangelog(
  changelog: DiscoveryChangelog,
): string {
  return `${JSON.stringify(changelog, null, 2)}\n`
}
