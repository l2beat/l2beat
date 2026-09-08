import { structuredPatch } from 'diff'
import type { DiffHunk, DiffLine, UnitDiff } from '../contract/schema.js'
import { comparableLines, countLines } from './normalize.js'

const CONTEXT_LINES = 3

/**
 * Unified diff from the audited text (old side) to the deployed text (new
 * side). `+` lines are deployed code missing from the audited version.
 *
 * Every changed line is classified as ignored or significant (see
 * `comparableText` in normalize.ts). A `+` line is ignored when its
 * comparable form is empty (comment-only line) or when the same comparable
 * form appears among the `-` lines of the same hunk (only a comment or a
 * require message changed). `-` lines are classified symmetrically. Only
 * significant lines count towards `added`/`removed` and coverage.
 */
export function buildUnitDiff(
  audited: string,
  deployed: string,
  options: {
    /**
     * Set when the comparable texts are equal (unit is identical). Every
     * changed line is then ignored, even when the line based classification
     * cannot pair it (e.g. a signature wrapped over a different number of
     * lines because a comment moved).
     */
    allIgnored?: boolean
  } = {},
): UnitDiff {
  const patch = structuredPatch(
    'audited',
    'deployed',
    audited,
    deployed,
    '',
    '',
    {
      context: CONTEXT_LINES,
    },
  )
  const oldComparable = comparableLines(audited)
  const newComparable = comparableLines(deployed)

  let added = 0
  let removed = 0
  let ignoredAdded = 0
  let ignoredRemoved = 0

  const hunks: DiffHunk[] = patch.hunks.map((hunk) => {
    let oldLine = hunk.oldStart
    let newLine = hunk.newStart
    const lines: DiffLine[] = []
    for (const raw of hunk.lines) {
      const marker = raw[0]
      const text = raw.slice(1)
      if (marker === '+') {
        lines.push({ type: '+', newLine: newLine++, text })
      } else if (marker === '-') {
        lines.push({ type: '-', oldLine: oldLine++, text })
      } else if (marker === ' ') {
        lines.push({ type: ' ', oldLine: oldLine++, newLine: newLine++, text })
      }
      // "\ No newline at end of file" markers are dropped
    }

    const removedForms = new Set(
      lines
        .filter((l) => l.type === '-')
        .map((l) => oldComparable[(l.oldLine ?? 1) - 1] ?? ''),
    )
    const addedForms = new Set(
      lines
        .filter((l) => l.type === '+')
        .map((l) => newComparable[(l.newLine ?? 1) - 1] ?? ''),
    )
    for (const line of lines) {
      if (line.type === '+') {
        const form = newComparable[(line.newLine ?? 1) - 1] ?? ''
        line.ignored =
          options.allIgnored || form === '' || removedForms.has(form)
        if (line.ignored) ignoredAdded++
        else added++
      } else if (line.type === '-') {
        const form = oldComparable[(line.oldLine ?? 1) - 1] ?? ''
        line.ignored = options.allIgnored || form === '' || addedForms.has(form)
        if (line.ignored) ignoredRemoved++
        else removed++
      }
    }

    return {
      oldStart: hunk.oldStart,
      oldLines: hunk.oldLines,
      newStart: hunk.newStart,
      newLines: hunk.newLines,
      lines,
    }
  })

  return {
    added,
    removed,
    ignoredAdded,
    ignoredRemoved,
    unchanged: countLines(deployed) - added,
    ignoredOnly: added === 0 && removed === 0,
    hunks,
  }
}
