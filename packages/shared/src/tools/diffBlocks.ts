/**
 * Extraction primitives for the ```diff blocks rendered into diffHistory.md
 * by discovery's discoveryDiffToMarkdown. These recover the mechanical facts
 * of a block — address, created/deleted status, field paths and raw value
 * lines — without classifying them. Consumers apply their own judgment
 * (severity, code vs state) on top.
 */

const DIFF_BLOCK_RE = /```diff\n([\s\S]*?)```/g
/** The parenthesized payload of the contract/EOA header line. Deliberately
 *  not EVM-specific: non-EVM addresses (e.g. Starknet felts) must be
 *  attributable rather than silently dropped. */
const DIFF_BLOCK_ADDRESS_RE = /^\s*(?:contract\s+.*?|EOA\s*)\(([^)\s]+)\)/im
const DIFF_BLOCK_STATUS_RE = /^[+-]\s+Status: (CREATED|DELETED)\s*$/im

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

export function extractDiffBlockStatus(
  body: string,
): 'created' | 'deleted' | undefined {
  const status = DIFF_BLOCK_STATUS_RE.exec(body)?.[1]
  return status === 'CREATED'
    ? 'created'
    : status === 'DELETED'
      ? 'deleted'
      : undefined
}

export interface DiffBlockFieldChange {
  /** Path exactly as written in the diff block, prefix included,
   *  e.g. "values.latestVerifier.9.verifier" or "upgradeability.admin". */
  key: string
  /** Path without the `values.`/`upgradeability.` prefix. */
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
  /** Raw removed value lines, `-` marker and indentation stripped. */
  removed: string[]
  /** Raw added value lines, `+` marker and indentation stripped. */
  added: string[]
}

const FIELD_LINE_RE = /^\s*((values|upgradeability)\.\S+):\s*$/

/** Changed value fields in one diff block, with their frozen annotations
 *  and raw value lines. */
export function extractDiffBlockFieldChanges(
  body: string,
): DiffBlockFieldChange[] {
  const changes: DiffBlockFieldChange[] = []
  let pendingHigh = false
  let current: DiffBlockFieldChange | undefined
  const finalize = () => {
    if (!current) return
    current.unchanged =
      current.removed.length > 0 &&
      normalizeDiffValueLines(current.removed) ===
        normalizeDiffValueLines(current.added)
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
      const path = match[1]?.slice((match[2]?.length ?? 0) + 1) ?? ''
      const first = path.split('.')[0] ?? path
      const field = match[2] === 'upgradeability' ? `$${first}` : first
      current = {
        key: match[1] ?? '',
        path,
        field,
        annotatedHigh: pendingHigh,
        unchanged: false,
        removed: [],
        added: [],
      }
      changes.push(current)
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
export function normalizeDiffValueLines(lines: readonly string[]): string {
  return lines
    .map((line) => line.replace(/\b[a-z0-9-]+:(?=0x)/gi, '').trim())
    .sort()
    .join('\n')
}
