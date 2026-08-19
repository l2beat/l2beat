import type { Range, SnapshotDomain, SnapshotIdentity } from './types'

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
 * present on one side only are not reported here - the disappeared / not yet
 * in the snapshot checks own those.
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

function formatIdentity(identity: SnapshotIdentity): string {
  return `- ${identity.id} (${identity.label}) [${formatRange(identity)}]`
}

type Domain = Pick<
  SnapshotDomain,
  'name' | 'wipeWarning' | 'freezeRecipe' | 'rangeChangeRecipe'
>

// Every message the guard can fail with lives here so the recipes can be
// asserted on directly and stay in one place.

export function removalMessage(
  domain: Domain,
  projectId: string,
  missing: SnapshotIdentity[],
): string {
  return [
    `${domain.name} identities disappeared for ${projectId}:`,
    ...missing.map(formatIdentity),
    domain.wipeWarning,
    domain.freezeRecipe,
    AI_GUARD_RAIL,
  ].join('\n')
}

export function rangeChangeMessage(
  domain: Domain,
  projectId: string,
  changes: RangeChange[],
): string {
  return [
    `${domain.name} ranges changed for ${projectId}:`,
    ...changes.map(
      (c) =>
        `- ${c.id} (${c.label}): ${formatRange(c.old)} => ${formatRange(c.new)}`,
    ),
    'On deploy the backend re-syncs the configuration to the new range and drops what it indexed outside it.',
    domain.rangeChangeRecipe,
    AI_GUARD_RAIL,
  ].join('\n')
}

export function additionMessage(
  domain: Domain,
  projectId: string,
  added: SnapshotIdentity[],
): string {
  return [
    `New ${domain.name} identities are not yet in the snapshot for ${projectId}:`,
    ...added.map(formatIdentity),
    'This is usually not a problem - it means a new data tracking configuration was added for this project (or an existing one was re-keyed; if this error appears together with a "disappeared" error for the same project, resolve that one first).',
    "To register the new identities, run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot.",
  ].join('\n')
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
