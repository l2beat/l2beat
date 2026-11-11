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
  // Line ranges that differ but are filtered out, in document order.
  filteredChanges: LineRangeMapping[]
  // Both kinds in characters, in document order. The merge view aligns the
  // sides only around its changes and assumes the text between them is the
  // same, so it gets the filtered ones too, and they are styled as unchanged.
  textChanges: Change[]
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
  const pieces = applyDecisions(lineDiff, original, modified, ignoreComments)
  const originalSide = { text: original, starts: lineStarts(originalLines) }
  const modifiedSide = { text: modified, starts: lineStarts(modifiedLines) }
  const lineChanges: LineRangeMapping[] = []
  const filteredChanges: LineRangeMapping[] = []
  const textChanges: Change[] = []
  for (const piece of pieces) {
    ;(piece.kept ? lineChanges : filteredChanges).push(piece.range)
    for (const change of textChangesOf(piece, originalSide, modifiedSide)) {
      textChanges.push(afterPrevious(change, textChanges.at(-1)))
    }
  }
  return { lineChanges, filteredChanges, textChanges }
}

interface Piece {
  range: LineRangeMapping
  kept: boolean
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

// Splits each change into the parts that stay changes and the parts that
// get filtered out, in document order.
function applyDecisions(
  changes: LineRangeMapping[],
  original: string,
  modified: string,
  ignoreComments: boolean,
): Piece[] {
  let decisions: ChangeDecision[]
  try {
    decisions = decideChanges(changes, original, modified, ignoreComments)
  } catch (error) {
    console.error('decideChanges failed; falling back to raw diff', error)
    return changes.map((range) => ({ range, kept: true }))
  }

  const pieces: Piece[] = []
  for (let i = 0; i < changes.length; i++) {
    const decision = decisions[i] as ChangeDecision
    const outer = changes[i] as LineRangeMapping
    if (decision.kind === 'keep') {
      pieces.push({ range: outer, kept: true })
      continue
    }
    if (decision.kind === 'drop') {
      pieces.push({ range: outer, kept: false })
      continue
    }
    // A narrowed change is filtered out before and after the part it keeps.
    const [before, after] = alignmentGaps(outer, decision)
    assert(before !== undefined && after !== undefined, 'Narrowed edges')
    const narrowed = {
      original: decision.original,
      modified: decision.modified,
    }
    for (const range of [before, narrowed, after]) {
      if (isNotEmpty(range)) {
        pieces.push({ range, kept: range === narrowed })
      }
    }
  }
  return pieces
}

function isNotEmpty(range: LineRangeMapping): boolean {
  return lineCount(range.original) > 0 || lineCount(range.modified) > 0
}

function lineCount(range: LineRange): number {
  return range.endLineNumberExclusive - range.startLineNumber
}

// A change moved onto the newline before it can reach into the change
// before it, which ends at the start of the same line.
function afterPrevious(change: Change, previous: Change | undefined): Change {
  if (
    previous === undefined ||
    (change.fromA >= previous.toA && change.fromB >= previous.toB)
  ) {
    return change
  }
  return new Change(
    Math.max(change.fromA, previous.toA),
    Math.max(change.toA, previous.toA),
    Math.max(change.fromB, previous.toB),
    Math.max(change.toB, previous.toB),
  )
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

// The character changes inside a kept line change, or the whole range of a
// filtered one. Changes start one character early, at the newline before
// their first line: the merge view reads a change that starts at the end of
// a line as starting on the next line, so this marks the first line
// whether or not it is blank, and a change at the end of the text still has
// a newline to carry it. A change on the first line of either side has no
// newline before it and starts where it is.
function textChangesOf(
  piece: Piece,
  original: SideText,
  modified: SideText,
): Change[] {
  const change = piece.range
  const startsLater =
    change.original.startLineNumber > 1 && change.modified.startLineNumber > 1
  const fromA = sideFrom(original, change.original, startsLater)
  const toA = sideTo(original, change.original)
  const fromB = sideFrom(modified, change.modified, startsLater)
  const toB = sideTo(modified, change.modified)
  if (
    !piece.kept ||
    lineCount(change.original) === 0 ||
    lineCount(change.modified) === 0
  ) {
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

function sideFrom(side: SideText, range: LineRange, startsLater: boolean) {
  const start = side.starts[range.startLineNumber - 1] as number
  if (startsLater) {
    return Math.min(start - 1, side.text.length)
  }
  return Math.min(start, side.text.length)
}

function sideTo(side: SideText, range: LineRange) {
  const end = side.starts[range.endLineNumberExclusive - 1] as number
  return Math.min(end, side.text.length)
}
