import { diff } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Anchor } from './render'
import { isWhitespace, lineOf, type Side } from './side'

// Comments are not in the AST, so a run of lines holding only comments or
// whitespace follows the first code line below it: marked when that line was
// added or removed outright, context when it has a counterpart. Only a run
// bordering an added or removed block is compared with the run above the
// counterpart, lines on one side only are marked there. Elsewhere comment
// changes are not shown.
export function markComments(
  before: Side,
  after: Side,
  anchors: Anchor[],
): void {
  const beforeStarts = commentRunStarts(before)
  const afterStarts = commentRunStarts(after)
  const counterpart = new Int32Array(before.lines.length).fill(-1)
  const anchoredAfter = new Uint8Array(after.lines.length)
  for (const [b, a] of anchors) {
    anchoredAfter[a] = 1
    if (counterpart[b] === -1 || a < (counterpart[b] as number)) {
      counterpart[b] = a
    }
  }
  const isNewBefore = (line: number) =>
    line >= 0 && before.changed[line] === 1 && counterpart[line] === -1
  const isNewAfter = (line: number) =>
    line >= 0 && after.changed[line] === 1 && anchoredAfter[line] === 0

  const compared = new Uint8Array(after.lines.length)
  for (let b = 0; b < before.lines.length; b++) {
    const start = beforeStarts[b] as number
    const a = counterpart[b] as number
    if (start === -1) continue
    if (isNewBefore(b)) {
      before.changed.fill(1, start, b)
    } else if (a !== -1 && compared[a] === 0) {
      compared[a] = 1
      const afterStart = afterStarts[a] as number
      assert(afterStart !== -1, 'Anchors are on code lines')
      if (isNewBefore(start - 1) || isNewAfter(afterStart - 1)) {
        markRunDifferences(before, start, b, after, afterStart, a)
      }
    }
  }
  for (let a = 0; a < after.lines.length; a++) {
    const start = afterStarts[a] as number
    if (start !== -1 && isNewAfter(a)) {
      after.changed.fill(1, start, a)
    }
  }
}

// Where the run of comment lines right above each code line starts, -1 for
// the comment lines themselves.
function commentRunStarts(side: Side): Int32Array {
  const hasCode = new Uint8Array(side.lines.length)
  for (let i = 0; i < side.source.length; i++) {
    if (side.comment[i] === 0 && !isWhitespace(side.source[i] as string)) {
      hasCode[lineOf(side, i)] = 1
    }
  }
  const starts = new Int32Array(side.lines.length).fill(-1)
  let start = 0
  for (let line = 0; line < side.lines.length; line++) {
    if (hasCode[line] === 1) {
      starts[line] = start
      start = line + 1
    }
  }
  return starts
}

function markRunDifferences(
  before: Side,
  beforeStart: number,
  beforeEnd: number,
  after: Side,
  afterStart: number,
  afterEnd: number,
): void {
  const left = before.lines.slice(beforeStart, beforeEnd).map((l) => l.trim())
  const right = after.lines.slice(afterStart, afterEnd).map((l) => l.trim())
  for (const d of diff(left, right)) {
    const index = d.path[0] as number
    if (d.kind === 'remove') before.changed[beforeStart + index] = 1
    if (d.kind === 'create') after.changed[afterStart + index] = 1
  }
}
