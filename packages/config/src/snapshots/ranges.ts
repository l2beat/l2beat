import type { SnapshotIdentity } from './types'

export interface Range {
  since: number
  until?: number
}

export interface RangeChange {
  id: string
  /** Label as committed in the snapshot, i.e. the old one. */
  label: string
  old: Range
  new: Range
}

/**
 * Compares the ranges of identities present in both snapshots. Identities that
 * only exist on one side are not reported here - the disappeared / not yet in
 * the snapshot checks own those.
 *
 * A changed range is never harmless: the backend re-syncs the configuration
 * from the new 'since' and drops everything indexed outside the new range.
 */
export function findRangeChanges(
  committed: SnapshotIdentity[],
  current: SnapshotIdentity[],
): RangeChange[] {
  const currentById = new Map(current.map((e) => [e.id, e]))
  const changes: RangeChange[] = []
  for (const old of committed) {
    const now = currentById.get(old.id)
    if (!now || (old.since === now.since && old.until === now.until)) {
      continue
    }
    changes.push({
      id: old.id,
      label: old.label,
      old: { since: old.since, until: old.until },
      new: { since: now.since, until: now.until },
    })
  }
  return changes
}

export function formatRange(range: Range): string {
  return `${range.since} -> ${range.until ?? 'open'}`
}
