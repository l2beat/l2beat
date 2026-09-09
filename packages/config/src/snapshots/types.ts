import { readFileSync } from 'fs'

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
  /**
   * The full configuration the identity was computed from. When the identity
   * disappears this is the only surviving copy of its fields, so the freeze
   * notice can print a paste-ready entry.
   */
  config: unknown
}

/** Project id -> identities, sorted by key and id for stable diffs. */
export type Snapshot = Record<string, SnapshotIdentity[]>

/**
 * What the snapshot file stores per identity: the id and the config it was
 * computed from. The label and the range are derived from the config on
 * load (SnapshotDomain.hydrate) so they cannot diverge from it. The id is
 * deliberately stored, not derived - if the hash function itself changes,
 * recomputing ids on load would hide that every configuration re-keys.
 */
export interface StoredIdentity {
  id: string
  config: unknown
}

export type StoredSnapshot = Record<string, StoredIdentity[]>

/** The file form of a snapshot: everything derivable dropped. */
export function toStored(snapshot: Snapshot): StoredSnapshot {
  return Object.fromEntries(
    Object.entries(snapshot).map(([projectId, identities]) => [
      projectId,
      identities.map(({ id, config }) => ({ id, config })),
    ]),
  )
}

/** Reads a domain's committed snapshot file and derives the rest via hydrate. */
export function readSnapshot(
  domain: Pick<SnapshotDomain, 'snapshotPath' | 'hydrate'>,
): Snapshot {
  const stored: StoredSnapshot = JSON.parse(
    readFileSync(domain.snapshotPath, 'utf8'),
  )
  return Object.fromEntries(
    Object.entries(stored).map(([projectId, identities]) => [
      projectId,
      identities.map(domain.hydrate),
    ]),
  )
}

/**
 * A guarded family of backend configuration identities. The committed
 * snapshot pins every identity together with its range; the guard test fails
 * when one disappears, when its range moves or when the snapshot is stale, so
 * every change is an explicit, reviewed decision. 'pnpm snapshots:generate'
 * registers additions and range updates but never drops a committed identity
 * - that takes '--overwrite'.
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
  /**
   * Renders a disappeared identity's `config` as a paste-ready source
   * literal for the freeze notice.
   */
  freezeSnippet?: (identity: SnapshotIdentity) => string
  /** Derives label and range from a stored identity's config. */
  hydrate: (stored: StoredIdentity) => SnapshotIdentity
  generate: () => Snapshot
}
