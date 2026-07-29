export interface SnapshotIdentity {
  id: string
  label: string
}

/** Project id -> identities, sorted by key and id for stable diffs. */
export type Snapshot = Record<string, SnapshotIdentity[]>

/**
 * A guarded family of backend configuration identities. The committed
 * snapshot pins every identity; the guard test fails when one disappears
 * or when the snapshot is stale, so identity changes are always an
 * explicit, reviewed decision (regenerate via 'pnpm snapshots:generate').
 */
export interface SnapshotDomain {
  /** Kebab-case name used in CLI args and test titles, e.g. 'da-tracking' */
  name: string
  /** Absolute path of the committed snapshot file */
  snapshotPath: string
  /** What the backend destroys when an identity disappears */
  wipeWarning: string
  generate: () => Snapshot
}
