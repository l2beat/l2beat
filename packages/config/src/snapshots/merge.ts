import type { Snapshot, SnapshotIdentity } from './types'

export interface MergeResult {
  merged: Snapshot
  /** Committed entries kept as-is because the fresh snapshot dropped or moved them. */
  preserved: number
}

/**
 * Append-only view of a regenerated snapshot: new identities from `fresh`
 * are taken in, but a committed entry whose id disappeared or whose range
 * moved is kept exactly as committed. Dropping or moving a committed entry
 * is the sign-off that accepts a wipe/re-sync, so it has to be asked for
 * explicitly ('pnpm snapshots:generate --overwrite').
 */
export function mergeSnapshots(
  committed: Snapshot,
  fresh: Snapshot,
): MergeResult {
  const merged: Snapshot = {}
  let preserved = 0

  const projectIds = new Set([...Object.keys(committed), ...Object.keys(fresh)])
  for (const projectId of projectIds) {
    const committedEntries = committed[projectId] ?? []
    const freshById = new Map((fresh[projectId] ?? []).map((e) => [e.id, e]))

    const entries: SnapshotIdentity[] = []
    for (const old of committedEntries) {
      const now = freshById.get(old.id)
      if (now && old.since === now.since && old.until === now.until) {
        entries.push(now)
      } else {
        // Disappeared or moved - keep the committed entry, label included.
        entries.push(old)
        preserved++
      }
      freshById.delete(old.id)
    }
    entries.push(...freshById.values())
    merged[projectId] = entries
  }

  return {
    merged: Object.fromEntries(
      Object.entries(merged)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([projectId, identities]) => [
          projectId,
          identities.sort((a, b) => a.id.localeCompare(b.id)),
        ]),
    ),
    preserved,
  }
}
