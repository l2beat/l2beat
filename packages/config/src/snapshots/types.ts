export interface Range {
  /**
   * Start of the tracked range, inclusive. Blocks or unix seconds depending
   * on the config it was built from - a range is only ever compared with
   * another range of the same config, so the unit never has to be named.
   */
  since: number
  /** Last covered point, inclusive. Absent means the range is still open. */
  until?: number
}

export interface SnapshotIdentity extends Range {
  id: string
  label: string
}

/** Project id -> identities, sorted by key and id for stable diffs. */
export type Snapshot = Record<string, SnapshotIdentity[]>

/**
 * A guarded family of backend configuration identities. The committed
 * snapshot pins every identity together with its range; the guard test fails
 * when one disappears, when its range moves or when the snapshot is stale, so
 * every change is an explicit, reviewed decision. 'pnpm snapshots:generate'
 * appends new identities only; accepting a removal or a range move takes
 * '--overwrite'.
 */
export interface SnapshotDomain {
  /** Kebab-case name used in CLI args and test titles, e.g. 'da-tracking' */
  name: string
  /** Absolute path of the committed snapshot file */
  snapshotPath: string
  /** What the backend destroys when an identity disappears */
  wipeWarning: string
  /**
   * Step-by-step, human-facing resolution for an identity that disappeared:
   * how to freeze the old configuration instead of letting it vanish.
   */
  freezeRecipe: string
  /**
   * Step-by-step, human-facing resolution for an identity whose range moved
   * while its id stayed the same.
   */
  rangeChangeRecipe: string
  generate: () => Snapshot
}
