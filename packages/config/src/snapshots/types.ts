export interface Range {
  /**
   * Start of the tracked range. Blocks or unix seconds depending on the
   * config the range was built from - the unit is implied by the config
   * type, both sides of a comparison always come from the same config.
   */
  since: number
  /**
   * Last covered point, inclusive (it becomes the indexer's maxHeight).
   * Absent means the range is still open.
   */
  until?: number
}

export interface SnapshotIdentity extends Range {
  id: string
  label: string
}

/** Project id -> identities, sorted by key and id for stable diffs. */
export type Snapshot = Record<string, SnapshotIdentity[]>

/** A config-level invariant violation, reported per project by the guard. */
export interface ConfigViolation {
  projectId: string
  message: string
}

/**
 * A guarded family of backend configuration identities. The committed
 * snapshot pins every identity; the guard test fails when one disappears,
 * when its range changed or when the snapshot is stale, so identity changes
 * are always an explicit, reviewed decision (regenerate via
 * 'pnpm snapshots:generate').
 */
export interface SnapshotDomain {
  /** Kebab-case name used in CLI args and test titles, e.g. 'da-tracking' */
  name: string
  /** Absolute path of the committed snapshot file */
  snapshotPath: string
  /** What the backend destroys when an identity disappears */
  wipeWarning: string
  /**
   * Multi-line, human-facing instructions for an identity that disappeared,
   * i.e. a config whose identity fields changed and that must be frozen
   * rather than edited in place.
   */
  freezeRecipe: string
  /**
   * Multi-line, human-facing instructions for a config whose identity is
   * unchanged but whose range moved. Deliberately different from
   * freezeRecipe: the id does not depend on the range, so "freeze and re-add"
   * would produce two entries with the same id.
   */
  rangeChangeRecipe: string
  generate: () => Snapshot
  /**
   * Optional invariants checked against the runtime configs (not the
   * snapshot file), e.g. coverage gaps between consecutive entries.
   */
  findConfigViolations?: () => ConfigViolation[]
}
