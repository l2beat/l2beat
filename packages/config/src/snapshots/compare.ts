import type { Range, Snapshot, SnapshotDomain, SnapshotIdentity } from './types'

/**
 * Appended to every message that reports data loss: resolving it takes
 * on-chain judgement and a deliberate decision an agent must not make.
 */
export const AI_GUARD_RAIL =
  "If you're an AI, don't address this error yourself - pass it over to a human."

export interface RangeChange {
  id: string
  /** Label as committed in the snapshot, i.e. the old one. */
  label: string
  old: Range
  new: Range
}

/**
 * Ranges that moved between the committed and the current identities. Ids
 * present on one side only are not reported here - they show up as
 * disappeared / appeared instead.
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

export interface SnapshotDiff {
  /** Not in the committed snapshot yet - the backend will sync them from scratch. */
  added: (SnapshotIdentity & { projectId: string })[]
  /** Committed ids that no longer exist - the backend wipes their data on deploy. */
  missing: (SnapshotIdentity & { projectId: string })[]
  /** Same id, moved window - the backend trims or re-indexes to the new range. */
  rangeChanges: (RangeChange & { projectId: string })[]
  unchanged: number
}

/** The one comparison both the guard test and 'da:preview' report from. */
export function diffSnapshots(
  committed: Snapshot,
  current: Snapshot,
): SnapshotDiff {
  const diff: SnapshotDiff = {
    added: [],
    missing: [],
    rangeChanges: [],
    unchanged: 0,
  }
  for (const projectId of new Set([
    ...Object.keys(committed),
    ...Object.keys(current),
  ])) {
    const old = committed[projectId] ?? []
    const now = current[projectId] ?? []
    const oldIds = new Set(old.map((e) => e.id))
    const nowIds = new Set(now.map((e) => e.id))
    diff.missing.push(
      ...old.filter((e) => !nowIds.has(e.id)).map((e) => ({ projectId, ...e })),
    )
    diff.added.push(
      ...now.filter((e) => !oldIds.has(e.id)).map((e) => ({ projectId, ...e })),
    )
    diff.rangeChanges.push(
      ...findRangeChanges(old, now).map((c) => ({ projectId, ...c })),
    )
    diff.unchanged += old.filter((e) => nowIds.has(e.id)).length
  }
  return diff
}

export function formatRange(range: Range): string {
  return `${range.since} -> ${range.until ?? 'open'}`
}

function formatIdentity(identity: SnapshotIdentity): string {
  return `- ${identity.id} (${identity.label}) [${formatRange(identity)}]`
}

type Domain = Pick<
  SnapshotDomain,
  'name' | 'wipeWarning' | 'freezeRecipe' | 'rangeChangeRecipe'
> &
  Partial<Pick<SnapshotDomain, 'freezeSnippet'>>

/**
 * The single per-project verdict of the guard: everything that differs
 * between the committed and the current identities in one message, so a
 * rotation (one id disappears, another appears) reads as one event with one
 * resolution instead of two failing tests with conflicting advice.
 *
 * Returns null when nothing changed.
 */
export function compareProject(
  domain: Domain,
  projectId: string,
  committed: SnapshotIdentity[],
  current: SnapshotIdentity[],
): string | null {
  const committedIds = new Set(committed.map((e) => e.id))
  const currentIds = new Set(current.map((e) => e.id))
  const removed = committed.filter((e) => !currentIds.has(e.id))
  const added = current.filter((e) => !committedIds.has(e.id))
  const rangeChanges = findRangeChanges(committed, current)

  if (!removed.length && !added.length && !rangeChanges.length) {
    return null
  }

  // Additions alone are the routine case - a new configuration was added and
  // just has to be registered.
  if (!removed.length && !rangeChanges.length) {
    return [
      `New ${domain.name} identities are not yet in the snapshot for ${projectId}:`,
      ...added.map(formatIdentity),
      "This is usually not a problem - it means a new data tracking configuration was added for this project. To register it, run 'pnpm snapshots:generate' in packages/config (it never drops committed identities) and commit the updated snapshot.",
    ].join('\n')
  }

  const lines = [`${domain.name} identities changed for ${projectId}:`]
  if (removed.length) {
    lines.push('disappeared:', ...removed.map(formatIdentity))
  }
  if (added.length) {
    lines.push(
      removed.length
        ? 'appeared (typically the new era of the same change):'
        : 'appeared:',
      ...added.map(formatIdentity),
    )
  }
  if (rangeChanges.length) {
    lines.push(
      'ranges changed:',
      ...rangeChanges.map(
        (c) =>
          `- ${c.id} (${c.label}): ${formatRange(c.old)} => ${formatRange(c.new)}`,
      ),
    )
  }
  if (removed.length) {
    lines.push(domain.wipeWarning, domain.freezeRecipe)
    const snippets = removed
      .map((e) => domain.freezeSnippet?.(e))
      .filter((s) => s !== undefined)
    if (snippets.length) {
      lines.push(
        "Frozen version of the disappeared entry to paste in front of the last element of the project's daTracking array (fill the until, step 2):",
        ...snippets,
      )
    }
  }
  if (rangeChanges.length) {
    lines.push(
      'On deploy the backend re-syncs a configuration whose range moved to the new range and drops what it indexed outside it.',
      domain.rangeChangeRecipe,
    )
  }
  lines.push(AI_GUARD_RAIL)
  return lines.join('\n')
}

export function duplicateIdsMessage(
  domain: Domain,
  duplicates: { id: string; owners: { projectId: string; label: string }[] }[],
): string {
  return [
    `${domain.name} has duplicate configuration ids:`,
    ...duplicates.map(
      ({ id, owners }) =>
        `- ${id}: ${owners.map((o) => `${o.projectId} (${o.label})`).join(', ')}`,
    ),
    'Two configs hash to the same backend configuration id, so the indexer cannot tell them apart. Only the identity fields are hashed, never the range - two entries that differ only in since/until collide.',
  ].join('\n')
}
