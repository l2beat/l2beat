/**
 * Presentation helpers over rendered diffHistory.md blocks, for the Updates
 * section and its cards (change counts, the high-severity badge, fenced diff
 * rendering). Nothing here feeds a metric: the ossification runtime consumes
 * the structured changelog.json that l2b records from the diff itself.
 */

const DIFF_BLOCK_RE = /```diff\n([\s\S]*?)```/g

export interface DiffBlockSpan {
  content: string
  start: number
  end: number
}

export function extractDiffBlockSpans(body: string): DiffBlockSpan[] {
  const spans: DiffBlockSpan[] = []
  const re = new RegExp(DIFF_BLOCK_RE.source, 'g')
  for (const match of body.matchAll(re)) {
    spans.push({
      content: (match[1] ?? '').replace(/\n$/, ''),
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
    })
  }
  return spans
}

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
 *  appended `$pastUpgrades` entry. Anchored to field lines, so
 *  `"implementation":` strings inside values (e.g. decoded timelock queues)
 *  never match. */
export function isImplementationChangeDiffBody(body: string): boolean {
  return readFieldLines(body).some(
    (field) =>
      isImplementationFieldChange(field) || isAppendedPastUpgrade(field),
  )
}

interface FieldLines {
  /** Path without the `values.`/`upgradeability.` prefix. */
  path: string
  removed: string[]
  added: string[]
}

const FIELD_LINE_RE = /^\s*(values|upgradeability)\.(\S+):\s*$/

function readFieldLines(body: string): FieldLines[] {
  const fields: FieldLines[] = []
  let current: FieldLines | undefined
  for (const line of body.split('\n')) {
    if (line.startsWith('+++')) continue
    const match = FIELD_LINE_RE.exec(line)
    if (match) {
      current = { path: match[2] ?? '', removed: [], added: [] }
      fields.push(current)
      continue
    }
    if (/^\s*-/.test(line)) {
      current?.removed.push(line.replace(/^\s*-\s*/, ''))
    } else if (/^\s*\+/.test(line)) {
      current?.added.push(line.replace(/^\s*\+\s*/, ''))
    } else if (line.trim() !== '') {
      current = undefined
    }
  }
  return fields
}

function isImplementationFieldChange(field: FieldLines): boolean {
  const name = field.path.split('.')[0]
  if (name !== '$implementation' && name !== 'implementation') return false
  if (field.removed.length === 0 && field.added.length === 0) return false
  // representation-only rewrites (chain-prefix migration) are not changes
  return normalize(field.removed) !== normalize(field.added)
}

/** A new `$pastUpgrades.<n>` entry (added, nothing removed) is a fresh
 *  onchain upgrade observation. Whole-array additions and sub-index format
 *  migrations do not qualify. */
function isAppendedPastUpgrade(field: FieldLines): boolean {
  return (
    /^\$pastUpgrades\.\d+$/.test(field.path) &&
    field.removed.length === 0 &&
    field.added.length > 0
  )
}

function normalize(lines: string[]): string {
  return lines
    .map((line) => line.replace(/\b[a-z0-9-]+:(?=0x)/gi, '').trim())
    .sort()
    .join('\n')
}
