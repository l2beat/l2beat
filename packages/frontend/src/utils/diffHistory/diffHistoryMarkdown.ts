const DIFF_BLOCK_RE = /```diff\n([\s\S]*?)```/g
const DIFF_BLOCK_ADDRESS_RE =
  /^\s*(?:contract\s+.*?|EOA\s*)\(((?:[a-z0-9-]+:)?0x[0-9a-f]{40})\)/im

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

export function extractDiffBlockAddress(body: string): string | undefined {
  return DIFF_BLOCK_ADDRESS_RE.exec(body)?.[1]?.toLowerCase()
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

export interface DiffBlockFieldChange {
  /** Path as written in the diff block, without the `values.` prefix,
   *  e.g. "latestVerifier.9.verifier" or "$admin". */
  path: string
  /** The severity-carrying unit: the first path segment, matching the key
   *  used in discovered.json `fieldMeta`. Legacy `upgradeability.X` paths
   *  map to their modern `$X` field names. */
  field: string
  /** Whether a `+++ severity: HIGH` annotation immediately preceded the
   *  field line when the diff was committed. This is the judgment frozen at
   *  review time — current metadata may since have changed. */
  annotatedHigh: boolean
  /** True when the removed and added values are equivalent after
   *  normalization: representation-only rewrites (chain-prefix migrations,
   *  reorderings) are not changes. */
  unchanged: boolean
}

const FIELD_LINE_RE = /^\s*(values|upgradeability)\.(\S+):\s*$/

/** Changed value fields in one diff block, with their frozen annotations. */
export function extractDiffBlockFieldChanges(
  body: string,
): DiffBlockFieldChange[] {
  const changes: DiffBlockFieldChange[] = []
  let pendingHigh = false
  let current: { removed: string[]; added: string[] } | undefined
  const finalize = () => {
    if (!current) return
    const change = changes.at(-1)
    if (change) {
      change.unchanged =
        current.removed.length > 0 &&
        normalizeDiffValues(current.removed) ===
          normalizeDiffValues(current.added)
    }
    current = undefined
  }
  for (const line of body.split('\n')) {
    if (/^\+\+\+ severity: HIGH\b/.test(line)) {
      pendingHigh = true
      continue
    }
    // other +++ annotations (description, type) keep the pending severity
    if (line.startsWith('+++')) continue

    const match = FIELD_LINE_RE.exec(line)
    if (match) {
      finalize()
      const path = match[2] ?? ''
      const first = path.split('.')[0] ?? path
      const field = match[1] === 'upgradeability' ? `$${first}` : first
      changes.push({
        path,
        field,
        annotatedHigh: pendingHigh,
        unchanged: false,
      })
      current = { removed: [], added: [] }
      pendingHigh = false
      continue
    }
    // diff value lines and blanks belong to the preceding field
    if (/^\s*-/.test(line)) {
      current?.removed.push(line.replace(/^\s*-\s*/, ''))
      continue
    }
    if (/^\s*\+/.test(line)) {
      current?.added.push(line.replace(/^\s*\+\s*/, ''))
      continue
    }
    if (line.trim() === '') continue
    finalize()
    pendingHigh = false
  }
  finalize()
  return changes
}

/** Sorted, chain-prefix-stripped value lines: two sides that agree here
 *  differ only in representation, not in substance. */
function normalizeDiffValues(lines: string[]): string {
  return lines
    .map((line) => line.replace(/\b[a-z0-9-]+:(?=0x)/gi, '').trim())
    .sort()
    .join('\n')
}

const APPENDED_UPGRADE_RE = /^\+\s+\["(\d{4}-\d{2}-\d{2}T[0-9:.]+Z)"/

/** Onchain timestamps of `$pastUpgrades` entries appended in this diff block.
 *  A watched-changes append is a new onchain upgrade observed by discovery;
 *  its embedded timestamp is the transaction time, which is more precise than
 *  the discovery-run timestamp of the surrounding update. */
export function extractAppendedUpgradeTimestamps(body: string): number[] {
  const timestamps: number[] = []
  const lines = body.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (!mentionsPastUpgradeEntry(lines[i] ?? '')) continue
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j] ?? ''
      if (line.trim() === '') continue
      const match = APPENDED_UPGRADE_RE.exec(line)
      if (match?.[1] !== undefined) {
        const parsed = Date.parse(match[1])
        if (Number.isFinite(parsed)) {
          timestamps.push(Math.floor(parsed / 1000))
        }
      }
      break
    }
  }
  return timestamps
}

export function isHighSeverityDiffBody(body: string): boolean {
  if (/^\+\+\+ severity: HIGH\b/im.test(body)) {
    return true
  }

  return isImplementationChangeDiffBody(body)
}

export function isImplementationChangeDiffBody(body: string): boolean {
  const lines = body.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const isImplementation = mentionsImplementationField(line)
    const isAppendedUpgrade = mentionsPastUpgradeEntry(line)
    if (!isImplementation && !isAppendedUpgrade) continue

    const isRelevantDiffLine = isAppendedUpgrade
      ? isAddedDiffValueLine
      : isDiffValueLine
    if (isRelevantDiffLine(line)) {
      return true
    }

    const nextMeaningfulLines = lines
      .slice(i + 1, i + 5)
      .filter((line) => line.trim() !== '')
    if (isAppendedUpgrade) {
      if (
        nextMeaningfulLines[0] !== undefined &&
        isAddedDiffValueLine(nextMeaningfulLines[0])
      ) {
        return true
      }
      continue
    }
    if (nextMeaningfulLines.some(isRelevantDiffLine)) {
      return true
    }
  }

  return false
}

function mentionsImplementationField(line: string): boolean {
  return /["']?\$?implementation["']?\s*:/i.test(line)
}

function mentionsPastUpgradeEntry(line: string): boolean {
  return /\$pastUpgrades\.\d+\s*:/i.test(line)
}

function isDiffValueLine(line: string): boolean {
  if (line.startsWith('+++') || line.startsWith('---')) {
    return false
  }

  return /^\s*[+-]\s+/.test(line)
}

function isAddedDiffValueLine(line: string): boolean {
  return !line.startsWith('+++') && /^\s*\+\s+/.test(line)
}
