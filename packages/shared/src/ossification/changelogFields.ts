/**
 * Reading changelog.json fields. These are the only rules that turn a recorded
 * field diff into "code changed", "state changed", or "nothing changed", shared
 * by the runtime and the research lint so the two can never disagree.
 */
import type { DiscoveryChangelogField } from '../tools/DiscoveryChangelog'

/** The severity-carrying unit of a changelog field path: the first segment,
 *  matching the key used in discovered.json `fieldMeta`. Legacy
 *  `upgradeability.X` paths map to their modern `$X` field names. */
export function canonicalDiffField(key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const prefix = key.slice(0, dot)
  const first = key.slice(dot + 1).split('.')[0] ?? ''
  if (prefix === 'values') return first
  if (prefix === 'upgradeability') return `$${first}`
  return undefined
}

/** Representation-only rewrites (chain-prefix migrations, reorderings) are
 *  not changes: both sides agree after normalization. */
export function isRepresentationOnly(field: DiscoveryChangelogField): boolean {
  return (
    (field.removed?.length ?? 0) > 0 &&
    normalizeDiffValueLines(field.removed ?? []) ===
      normalizeDiffValueLines(field.added ?? [])
  )
}

/** Sorted, chain-prefix-stripped value lines: two sides that agree here
 *  differ only in representation, not in substance. */
export function normalizeDiffValueLines(lines: readonly string[]): string {
  return lines
    .map((line) => line.replace(/\b[a-z0-9-]+:(?=0x)/gi, '').trim())
    .sort()
    .join('\n')
}

/** An executable-code change: an actual `$implementation` change, or a
 *  freshly appended `$pastUpgrades` entry (a new onchain upgrade observed by
 *  discovery). Anchored to field paths, so `"implementation":` inside another
 *  field's value (e.g. a decoded timelock queue) never matches. */
export function isImplementationChangeField(
  field: DiscoveryChangelogField,
): boolean {
  if (canonicalDiffField(field.key) === '$implementation') {
    return (
      ((field.removed?.length ?? 0) > 0 || (field.added?.length ?? 0) > 0) &&
      !isRepresentationOnly(field)
    )
  }
  return appendedUpgradeTimestamp(field) !== undefined
}

const APPENDED_UPGRADE_VALUE_RE = /^\["(\d{4}-\d{2}-\d{2}T[0-9:.]+Z)"/

/** The onchain timestamp of a freshly appended `$pastUpgrades` entry: a new
 *  single-index element (added, nothing removed) whose value embeds the
 *  transaction time. Whole-array additions and sub-index format migrations
 *  are handler backfills, not fresh observations. */
export function appendedUpgradeTimestamp(
  field: DiscoveryChangelogField,
): number | undefined {
  if (!/^values\.\$pastUpgrades\.\d+$/.test(field.key)) return undefined
  if ((field.removed?.length ?? 0) > 0) return undefined
  const match = APPENDED_UPGRADE_VALUE_RE.exec(field.added?.[0] ?? '')
  if (match?.[1] === undefined) return undefined
  const parsed = Date.parse(match[1])
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : undefined
}
