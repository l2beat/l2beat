/**
 * Structurally compatible with Snapshot from @l2beat/config snapshots. Only
 * the identity is diffed here - since/until changes are caught by the guard
 * test in packages/config, which knows how to explain them.
 */
export type IdentitySnapshot = Record<string, { id: string; label: string }[]>

export interface SnapshotDiffEntry {
  projectId: string
  id: string
  label: string
}

export interface SnapshotDiff {
  /** Configurations that do not exist yet - the backend will sync them from scratch. */
  added: SnapshotDiffEntry[]
  /** Configurations whose id disappeared - the backend WILL WIPE their data on deploy. */
  removed: SnapshotDiffEntry[]
  unchanged: number
}

export function diffSnapshots(
  current: IdentitySnapshot,
  committed: IdentitySnapshot,
): SnapshotDiff {
  const flatten = (snapshot: IdentitySnapshot) =>
    new Map(
      Object.entries(snapshot).flatMap(([projectId, identities]) =>
        identities.map(
          (identity) =>
            [
              `${projectId}:${identity.id}`,
              { projectId, id: identity.id, label: identity.label },
            ] as const,
        ),
      ),
    )

  const currentEntries = flatten(current)
  const committedEntries = flatten(committed)

  const added = [...currentEntries.entries()]
    .filter(([key]) => !committedEntries.has(key))
    .map(([, entry]) => entry)
  const removed = [...committedEntries.entries()]
    .filter(([key]) => !currentEntries.has(key))
    .map(([, entry]) => entry)
  const unchanged = [...currentEntries.keys()].filter((key) =>
    committedEntries.has(key),
  ).length

  return { added, removed, unchanged }
}
