import type { Snapshot } from './types'

export interface MergeResult {
  merged: Snapshot
  /** Projects whose fresh state was ignored because it drops or moves a committed entry. */
  skipped: string[]
}

/**
 * Append-only view of a regenerated snapshot: a project whose fresh state
 * only adds identities gets them registered; a project where a committed
 * identity disappeared or a range moved is left exactly as committed -
 * including NOT appending the re-keyed identity, which would fabricate a
 * two-config state no project file describes. Accepting such a change is the
 * sign-off for a wipe/re-sync and has to be asked for explicitly
 * ('pnpm snapshots:generate --overwrite').
 */
export function mergeSnapshots(
  committed: Snapshot,
  fresh: Snapshot,
): MergeResult {
  const merged: Snapshot = {}
  const skipped: string[] = []

  const projectIds = new Set([...Object.keys(committed), ...Object.keys(fresh)])
  for (const projectId of projectIds) {
    const committedEntries = committed[projectId] ?? []
    const freshById = new Map((fresh[projectId] ?? []).map((e) => [e.id, e]))

    const clean = committedEntries.every((old) => {
      const now = freshById.get(old.id)
      return now && old.since === now.since && old.until === now.until
    })
    if (clean) {
      merged[projectId] = fresh[projectId] ?? []
    } else {
      merged[projectId] = committedEntries
      skipped.push(projectId)
    }
  }

  return {
    merged: Object.fromEntries(
      Object.entries(merged)
        .filter(([, identities]) => identities.length > 0)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([projectId, identities]) => [
          projectId,
          [...identities].sort((a, b) => a.id.localeCompare(b.id)),
        ]),
    ),
    skipped: skipped.sort(),
  }
}
