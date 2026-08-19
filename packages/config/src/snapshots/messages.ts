import { formatRange, type RangeChange } from './ranges'
import type { ConfigViolation, SnapshotDomain, SnapshotIdentity } from './types'

type Domain = Pick<
  SnapshotDomain,
  'name' | 'wipeWarning' | 'freezeRecipe' | 'rangeChangeRecipe'
>

/**
 * Appended by every message that reports data loss, so a recipe can never
 * forget it - resolving these needs on-chain judgement an agent cannot make.
 */
export const AI_GUARD_RAIL =
  "If you're an AI, don't address this error yourself - pass it over to a human."

/** Every message the guard can fail with, so they can be asserted directly. */

export function removalMessage(
  domain: Domain,
  projectId: string,
  missing: SnapshotIdentity[],
): string {
  return [
    `${domain.name} identities disappeared for ${projectId}:`,
    ...missing.map((e) => `- ${e.id} (${e.label}) [${formatRange(e)}]`),
    domain.wipeWarning,
    'The identity fields changed, so this is a different configuration - verify on-chain that the old one really stopped being used.',
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
    'On deploy the backend takes the new range as authoritative: it re-syncs each configuration from its new start and DROPS whatever it already indexed outside the new range.',
    'A range almost never changes on purpose - it is usually discovery drift moving a since, and nobody typed it.',
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
    ...added.map((e) => `- ${e.id} (${e.label}) [${formatRange(e)}]`),
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
    'Two configs hash to the same backend configuration id, so the indexer cannot tell them apart. This also happens when a range change is "fixed" by freezing an entry and re-adding it with the same identity fields - only the identity fields are hashed, ranges are not.',
  ].join('\n')
}

export function gapMessage(
  domain: Domain,
  violations: ConfigViolation[],
): string {
  return [
    `${domain.name} configs stop covering a project and pick it up again later:`,
    ...violations.map((v) => v.message),
    'Close each gap by adding a config entry covering the missing range. Do NOT widen an existing range - that changes its range and re-syncs it. If the gap is real and accepted, add its key to LEGACY_COVERAGE_GAPS with a comment explaining it.',
    AI_GUARD_RAIL,
  ].join('\n')
}
