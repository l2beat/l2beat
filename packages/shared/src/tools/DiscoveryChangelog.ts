/**
 * changelog.json: a deterministic, machine-readable projection of a project's
 * diffHistory.md watched changes. It records mechanical facts only — entry
 * identity, run timestamp, and per-contract field diffs with raw values —
 * never classifications (severity, code vs state), so downstream judgments
 * stay retroactively re-appliable.
 *
 * l2b regenerates the file from the diffHistory.md content it just composed
 * whenever the file is already maintained for a project (see
 * updateDiffHistory), and `buildDiscoveryChangelog` is the single converter
 * shared by l2b, the one-time backfill, and the CI `--check`, so the two
 * artifacts cannot drift.
 */
import {
  extractDiffBlockAddress,
  extractDiffBlockFieldChanges,
  extractDiffBlockSpans,
  extractDiffBlockStatus,
} from '@l2beat/shared-pure'
import type { ChainPoint, DiffHistoryEntry } from './DiffHistoryParser'
import { DiffHistoryParser } from './DiffHistoryParser'
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
  /** Lowercased address as written in the block header (chain-prefixed for
   *  modern entries, bare for legacy ones). */
  address: string
  status?: 'created' | 'deleted'
  fields?: DiscoveryChangelogField[]
}

export interface DiscoveryChangelogField {
  /** Path exactly as written in the diff block, prefix included. */
  key: string
  removed?: string[]
  added?: string[]
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

export function buildDiscoveryChangelog(
  diffHistoryContent: string,
): DiscoveryChangelog {
  const entries: DiscoveryChangelogEntry[] = []
  const idFor = createDiffHistoryEntryIdFactory()
  for (const entry of new DiffHistoryParser().parse(diffHistoryContent)) {
    // ids are assigned to every entry (before filtering) so ordinals agree
    // with other consumers of the same file
    const id = idFor(entry.date, entry.current)
    const changes = extractEntryChanges(entry)
    if (changes.length === 0) continue
    entries.push({
      id,
      timestamp: getDiffHistoryEntryTimestamp(entry.date, entry.current),
      changes,
    })
  }
  return { formatVersion: 1, entries }
}

function extractEntryChanges(
  entry: DiffHistoryEntry,
): DiscoveryChangelogContract[] {
  const changes: DiscoveryChangelogContract[] = []
  for (const section of entry.sections) {
    if (section.kind !== 'watched-changes') continue
    for (const { content } of extractDiffBlockSpans(section.body)) {
      const address = extractDiffBlockAddress(content)
      if (!address) continue
      const status = extractDiffBlockStatus(content)
      const fields = extractDiffBlockFieldChanges(content).map(
        (change): DiscoveryChangelogField => ({
          key: change.key,
          ...(change.removed.length > 0 ? { removed: change.removed } : {}),
          ...(change.added.length > 0 ? { added: change.added } : {}),
        }),
      )
      changes.push({
        address,
        ...(status ? { status } : {}),
        ...(fields.length > 0 ? { fields } : {}),
      })
    }
  }
  return changes
}

export function serializeDiscoveryChangelog(
  changelog: DiscoveryChangelog,
): string {
  return `${JSON.stringify(changelog, null, 2)}\n`
}
