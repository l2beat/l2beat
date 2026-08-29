/**
 * Classification helpers over the diff-block extraction primitives in
 * @l2beat/shared. Extraction (spans, addresses, field paths, raw values)
 * lives there because l2b's changelog.json writer shares it; the judgments
 * here (what counts as high severity, what is an implementation change) are
 * presentation- and audit-side only — the ossification runtime consumes the
 * structured changelog.json instead of parsing markdown.
 */
import {
  type DiffBlockFieldChange,
  extractDiffBlockFieldChanges,
  extractDiffBlockSpans,
} from '@l2beat/shared'

export {
  type DiffBlockFieldChange,
  type DiffBlockSpan,
  extractDiffBlockAddress,
  extractDiffBlockFieldChanges,
  extractDiffBlockSpans,
} from '@l2beat/shared'

export function countDiffChanges(body: string): number {
  return extractDiffBlockSpans(body)
    .map(({ content }) => countChangesInDiff(content.split('\n')))
    .reduce((sum, count) => sum + count, 0)
}

function countChangesInDiff(lines: string[]): number {
  let count = 0
  let previousWasChange = false

  for (const line of lines) {
    const isChange = isChangeLine(line)
    if (isChange && !previousWasChange) {
      count++
    }
    previousWasChange = isChange
  }

  return count
}

function isChangeLine(line: string): boolean {
  if (line.startsWith('+++') || line.startsWith('---')) {
    return false
  }
  return /^\s*[+-]\s/.test(line)
}

export function isHighSeverityDiffBody(body: string): boolean {
  if (/^\+\+\+ severity: HIGH\b/im.test(body)) {
    return true
  }

  return isImplementationChangeDiffBody(body)
}

/** Whether a diff block changes executable code: an actual `$implementation`
 *  field change (representation-only rewrites excluded), or a freshly
 *  appended `$pastUpgrades` entry. Anchored to parsed field paths, so
 *  `"implementation":` strings inside values (e.g. decoded timelock queues)
 *  never match. */
export function isImplementationChangeDiffBody(body: string): boolean {
  return extractDiffBlockFieldChanges(body).some(
    (change) =>
      isImplementationFieldChange(change) || isAppendedPastUpgrade(change),
  )
}

function isImplementationFieldChange(change: DiffBlockFieldChange): boolean {
  return (
    change.field === '$implementation' &&
    (change.removed.length > 0 || change.added.length > 0) &&
    !change.unchanged
  )
}

/** A new `$pastUpgrades.<n>` entry (added, nothing removed) is a fresh
 *  onchain upgrade observation. Whole-array additions and sub-index format
 *  migrations do not qualify. */
function isAppendedPastUpgrade(change: DiffBlockFieldChange): boolean {
  return (
    /^\$pastUpgrades\.\d+$/.test(change.path) &&
    change.removed.length === 0 &&
    change.added.length > 0
  )
}
