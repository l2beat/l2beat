import type { Snapshot } from './types'

export interface MergeResult {
  merged: Snapshot
  /** Projects whose fresh state was ignored because it drops a committed identity. */
  skipped: string[]
}

/**
 * Identity-preserving view of a regenerated snapshot: additions and range
 * updates (closing an entry with untilBlock is the encouraged workflow) flow
 * through, but a project where a committed identity DISAPPEARED is left
 * exactly as committed - including NOT appending the re-keyed identity,
 * which would fabricate a two-config state no project file describes.
 * Dropping an identity wipes its data, so it has to be asked for explicitly
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

    const clean = committedEntries.every((old) => freshById.has(old.id))
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
