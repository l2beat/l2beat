import { Change, diff, presentableDiff } from '@codemirror/merge'
import { assert } from '@l2beat/shared-pure'
import {
  alignmentGaps,
  type ChangeDecision,
  decideChanges,
  type LineRange,
  type LineRangeMapping,
} from './utils/diffFilter'

export interface ComputedDiff {
  // Line ranges that stay changes after filtering, in document order.
  lineChanges: LineRangeMapping[]
  // The same changes in characters, for the merge view to highlight.
  textChanges: Change[]
  // Filtered out ranges whose sides differ in length. The shorter side gets
  // padded so the lines below stay aligned.
  alignmentGaps: LineRangeMapping[]
}

// Characters a line can be encoded as: the Basic Multilingual Plane without
// surrogates. The largest flat sources have about 19k lines, so two of them
// fit.
const SURROGATES_START = 0xd800
const SURROGATES_COUNT = 0x800
const MAX_UNIQUE_LINES = 0x10000 - SURROGATES_COUNT
const LINE_DIFF_TIMEOUT_MS = 5000

export function computeDiff(
  original: string,
  modified: string,
  ignoreComments: boolean,
): ComputedDiff {
  const originalLines = original.split('\n')
  const modifiedLines = modified.split('\n')
  const lineDiff = diffLines(originalLines, modifiedLines)
  const { kept, gaps } = applyDecisions(
    lineDiff,
    original,
    modified,
    ignoreComments,
  )
  const originalStarts = lineStarts(originalLines)
  const modifiedStarts = lineStarts(modifiedLines)
  const textChanges: Change[] = []
  for (const change of kept) {
    textChanges.push(
      ...textChangesOf(
        change,
        { text: original, starts: originalStarts },
        { text: modified, starts: modifiedStarts },
      ),
    )
  }
  return { lineChanges: kept, textChanges, alignmentGaps: gaps }
}

// Diffs lines as whole units: each distinct line becomes one character, and
// the character diff of the two encodings is the line diff.
function diffLines(
  originalLines: string[],
  modifiedLines: string[],
): LineRangeMapping[] {
  const codes = new Map<string, string>()
  const encode = (lines: string[]) => {
    let encoded = ''
    for (const line of lines) {
      let code = codes.get(line)
      if (code === undefined) {
        code = String.fromCharCode(characterCode(codes.size))
        codes.set(line, code)
      }
      encoded += code
    }
    return encoded
  }
  const encodedOriginal = encode(originalLines)
  const encodedModified = encode(modifiedLines)
  assert(codes.size <= MAX_UNIQUE_LINES, 'Too many unique lines to diff')
  return diff(encodedOriginal, encodedModified, {
    timeout: LINE_DIFF_TIMEOUT_MS,
  }).map((change) => ({
    original: lineRange(change.fromA, change.toA),
    modified: lineRange(change.fromB, change.toB),
  }))
}

function characterCode(index: number): number {
  return index < SURROGATES_START ? index : index + SURROGATES_COUNT
}

function lineRange(fromIndex: number, toIndex: number): LineRange {
  return { startLineNumber: fromIndex + 1, endLineNumberExclusive: toIndex + 1 }
}

function applyDecisions(
  changes: LineRangeMapping[],
  original: string,
  modified: string,
  ignoreComments: boolean,
): { kept: LineRangeMapping[]; gaps: LineRangeMapping[] } {
  let decisions: ChangeDecision[]
  try {
    decisions = decideChanges(changes, original, modified, ignoreComments)
  } catch (error) {
    console.error('decideChanges failed; falling back to raw diff', error)
    return { kept: changes, gaps: [] }
  }

  const kept: LineRangeMapping[] = []
  const gaps: LineRangeMapping[] = []
  for (let i = 0; i < changes.length; i++) {
    const decision = decisions[i] as ChangeDecision
    const outer = changes[i] as LineRangeMapping
    if (decision.kind === 'keep') {
      kept.push(outer)
    } else if (decision.kind === 'narrow') {
      kept.push({ original: decision.original, modified: decision.modified })
    }
    gaps.push(...alignmentGaps(outer, decision))
  }
  return { kept, gaps }
}

interface SideText {
  text: string
  // Offset of every line's start, plus one past the end of the text as if
  // the last line ended with a newline.
  starts: number[]
}

function lineStarts(lines: string[]): number[] {
  const starts = [0]
  for (const line of lines) {
    starts.push((starts[starts.length - 1] as number) + line.length + 1)
  }
  return starts
}

// The character changes inside a line change. A change that reaches the end
// of the text starts one character early, at the newline before it, because
// the last line has no newline of its own to carry the difference.
function textChangesOf(
  change: LineRangeMapping,
  original: SideText,
  modified: SideText,
): Change[] {
  const reachesEnd =
    change.original.endLineNumberExclusive >= original.starts.length ||
    change.modified.endLineNumberExclusive >= modified.starts.length
  const fromA = sideFrom(original, change.original, reachesEnd)
  const toA = sideTo(original, change.original)
  const fromB = sideFrom(modified, change.modified, reachesEnd)
  const toB = sideTo(modified, change.modified)
  if (fromA === toA || fromB === toB) {
    return [new Change(fromA, toA, fromB, toB)]
  }
  return presentableDiff(
    original.text.slice(fromA, toA),
    modified.text.slice(fromB, toB),
  ).map(
    (inner) =>
      new Change(
        inner.fromA + fromA,
        inner.toA + fromA,
        inner.fromB + fromB,
        inner.toB + fromB,
      ),
  )
}

function sideFrom(side: SideText, range: LineRange, reachesEnd: boolean) {
  const start = side.starts[range.startLineNumber - 1] as number
  if (reachesEnd && start > 0) {
    return Math.min(start - 1, side.text.length)
  }
  return Math.min(start, side.text.length)
}

function sideTo(side: SideText, range: LineRange) {
  const end = side.starts[range.endLineNumberExclusive - 1] as number
  return Math.min(end, side.text.length)
}
