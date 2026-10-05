import { type Difference, diff } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import { markComments } from './comments'
import { isNode, normalize, rangeOf } from './normalize'
import { pairDeclarations } from './pairDeclarations'
import {
  type Anchor,
  closeChangedLines,
  type LineChange,
  renderLines,
} from './render'
import type { Rule } from './rules'
import { isWhitespace, lineOf, type Side, stringEnd, toSide } from './side'

export interface SolidityDiff {
  differences: Difference[]
  lines: LineChange[]
  added: number
  removed: number
}

export function diffSolidity(
  before: string,
  after: string,
  rules: Rule[],
): SolidityDiff {
  const left = normalize(before, rules)
  const right = normalize(after, rules)
  pairDeclarations(left, right)
  const differences = diff(left, right)

  const beforeSide = toSide(before)
  const afterSide = toSide(after)
  const anchors = markChanges(left, right, differences, beforeSide, afterSide)
  closeChangedLines(beforeSide, afterSide, anchors)
  markComments(beforeSide, afterSide, anchors)
  const lines = renderLines(beforeSide, afterSide, anchors)
  const added = lines.filter((line) => line.type === 'added').length
  const removed = lines.filter((line) => line.type === 'removed').length
  return { differences, lines, added, removed }
}

interface DifferenceIndex {
  // Keys of the containers holding a difference somewhere below.
  touched: Set<string>
  removed: Set<string>
  created: Set<string>
  byParent: Map<string, Difference[]>
}

interface Pair {
  l: object
  r: object
  key: string
  lOwner: AST.ASTNode
  rOwner: AST.ASTNode
}

// The shared `diff` says what differs but not which nodes correspond, and its
// paths use left indices. One walk down both trees along those paths pairs
// the nodes it compared (arrays pair in order once removed and created
// elements are skipped), marks the lines of every difference on both sides
// and collects anchors between paired nodes.
function markChanges(
  left: AST.ASTNode,
  right: AST.ASTNode,
  differences: Difference[],
  before: Side,
  after: Side,
): Anchor[] {
  const index = indexDifferences(differences)
  const anchors: Anchor[] = []
  const work: Pair[] = [
    { l: left, r: right, key: '', lOwner: left, rOwner: right },
  ]
  while (work.length > 0) {
    const pair = work.pop() as Pair
    const identical = !index.touched.has(pair.key)
    if (isNode(pair.l) && isNode(pair.r)) {
      anchors.push(...nodeAnchors(pair.l, pair.r, identical, before, after))
      pair.lOwner = pair.l
      pair.rOwner = pair.r
    }
    const changes = index.byParent.get(pair.key) ?? []
    if (markDifferenceLines(changes, before, after)) {
      markOwnChanges(pair.lOwner, pair.rOwner, before, after, anchors)
    }
    // An identical node anchors itself, but an array or a keyed declaration
    // list has no range, so the walk goes on until it reaches nodes.
    if (!identical || !isNode(pair.l)) {
      work.push(...childPairs(pair, index))
    }
  }
  return anchors
}

function indexDifferences(differences: Difference[]): DifferenceIndex {
  const index: DifferenceIndex = {
    touched: new Set(),
    removed: new Set(),
    created: new Set(),
    byParent: new Map(),
  }
  for (const d of differences) {
    let key = ''
    for (const segment of d.path.slice(0, -1)) {
      index.touched.add(key)
      key = childKey(key, segment)
    }
    index.touched.add(key)
    const siblings = index.byParent.get(key) ?? []
    siblings.push(d)
    index.byParent.set(key, siblings)
    const last = childKey(key, d.path[d.path.length - 1] as string | number)
    if (d.kind === 'remove') index.removed.add(last)
    if (d.kind === 'create') index.created.add(last)
  }
  return index
}

function childPairs(pair: Pair, index: DifferenceIndex): Pair[] {
  const { l, r, key, lOwner, rOwner } = pair
  const pairs: Pair[] = []
  const add = (lChild: unknown, rChild: unknown, childKey: string) => {
    if (isObject(lChild) && isObject(rChild)) {
      pairs.push({ l: lChild, r: rChild, key: childKey, lOwner, rOwner })
    }
  }
  if (Array.isArray(l) && Array.isArray(r)) {
    let j = 0
    for (let i = 0; i < l.length; i++) {
      if (index.removed.has(childKey(key, i))) continue
      while (index.created.has(childKey(key, j))) j++
      add(l[i], r[j++], childKey(key, i))
    }
  } else {
    const lFields = l as Record<string, unknown>
    const rFields = r as Record<string, unknown>
    for (const field in lFields) {
      add(lFields[field], rFields[field], childKey(key, field))
    }
  }
  return pairs
}

// Two changed nodes only line up where they hold their own text. A
// SourceUnit starts wherever its first child does, and the first children
// may be different declarations. Two identical nodes line up where both
// hold their own text or neither does: a block made up by `bracedBodies`
// holds no braces, a real one does.
function nodeAnchors(
  l: AST.ASTNode,
  r: AST.ASTNode,
  identical: boolean,
  before: Side,
  after: Side,
): Anchor[] {
  const [lStart, lEnd] = rangeOf(l)
  const [rStart, rEnd] = rangeOf(r)
  const [lOwnStart, lOwnEnd] = ownEnds(l)
  const [rOwnStart, rOwnEnd] = ownEnds(r)
  const anchors: Anchor[] = []
  if (identical ? lOwnStart === rOwnStart : lOwnStart && rOwnStart) {
    anchors.push([lineOf(before, lStart), lineOf(after, rStart)])
  }
  if (identical ? lOwnEnd === rOwnEnd : lOwnEnd && rOwnEnd) {
    anchors.push([lineOf(before, lEnd), lineOf(after, rEnd)])
  }
  return anchors
}

function ownEnds(node: AST.ASTNode): [boolean, boolean] {
  const [start, end] = rangeOf(node)
  const children = childNodes(node)
  return [
    children.every((child) => rangeOf(child)[0] !== start),
    children.every((child) => rangeOf(child)[1] !== end),
  ]
}

// Removed and created nodes mark their lines, so does an array of them
// (arguments removed as one). Any other value lives in the owner's own text,
// and so do the brackets and commas of an array.
function markDifferenceLines(
  differences: Difference[],
  before: Side,
  after: Side,
): boolean {
  let valueChanged = false
  for (const d of differences) {
    if (d.kind !== 'create' && !markNodeLines(before, d.lhs)) {
      valueChanged = true
    }
    if (d.kind !== 'remove' && !markNodeLines(after, d.rhs)) {
      valueChanged = true
    }
  }
  return valueChanged
}

function markNodeLines(side: Side, value: unknown): boolean {
  for (const item of Array.isArray(value) ? value : [value]) {
    if (isNode(item)) {
      const [start, end] = rangeOf(item)
      side.changed.fill(1, lineOf(side, start), lineOf(side, end) + 1)
    }
  }
  return isNode(value)
}

// A changed value like visibility lives somewhere in the node's own text: its
// range minus the ranges of its children. Diffing that text word by word,
// ignoring where the lines break, marks only the lines holding a word that
// differs. Words that match anchor their lines.
function markOwnChanges(
  l: AST.ASTNode,
  r: AST.ASTNode,
  before: Side,
  after: Side,
  anchors: Anchor[],
): void {
  const left = ownTokens(before, l)
  const right = ownTokens(after, r)
  const removed = new Set<unknown>()
  const created = new Set<unknown>()
  const changed = new Set<unknown>()
  for (const d of diff(left.texts, right.texts)) {
    const set =
      d.kind === 'remove' ? removed : d.kind === 'create' ? created : changed
    set.add(d.path[0])
  }
  if (removed.size + created.size + changed.size === 0) {
    for (const line of left.lines) before.changed[line] = 1
    for (const line of right.lines) after.changed[line] = 1
    return
  }
  let j = 0
  for (let i = 0; i < left.lines.length; i++) {
    const b = left.lines[i] as number
    if (removed.has(i)) {
      before.changed[b] = 1
      continue
    }
    while (created.has(j)) {
      after.changed[right.lines[j++] as number] = 1
    }
    const a = right.lines[j++] as number
    if (changed.has(i)) {
      before.changed[b] = 1
      after.changed[a] = 1
    } else {
      anchors.push([b, a])
    }
  }
  for (; j < right.lines.length; j++) {
    after.changed[right.lines[j] as number] = 1
  }
}

// Comments inside the own text are no words of it, else a word in a comment
// could anchor a code line to a comment line. A string is one word, its
// whitespace is data.
function ownTokens(
  side: Side,
  node: AST.ASTNode,
): { lines: number[]; texts: string[] } {
  const [start, end] = rangeOf(node)
  const own = new Uint8Array(end - start + 1).fill(1)
  for (const child of childNodes(node)) {
    const [childStart, childEnd] = rangeOf(child)
    assert(childStart >= start && childEnd <= end, 'Child inside parent')
    own.fill(0, childStart - start, childEnd - start + 1)
  }
  const lines: number[] = []
  const texts: string[] = []
  let inWord = false
  for (let i = 0; i < own.length; i++) {
    const c = side.source[start + i] as string
    if (own[i] === 0 || side.comment[start + i] === 1 || isWhitespace(c)) {
      inWord = false
      continue
    }
    if (c === '"' || c === "'") {
      const stop = stringEnd(side.source, start + i)
      assert(stop <= end + 1, 'String inside its node')
      lines.push(lineOf(side, start + i))
      texts.push(side.source.slice(start + i, stop))
      i = stop - start - 1
      inWord = false
      continue
    }
    if (inWord && isWordCharacter(c)) {
      texts[texts.length - 1] += c
      continue
    }
    lines.push(lineOf(side, start + i))
    texts.push(c)
    inWord = isWordCharacter(c)
  }
  return { lines, texts }
}

// Children sit in fields, in arrays and, once declarations are paired, in
// keyed lists.
function childNodes(node: AST.ASTNode): AST.ASTNode[] {
  const result: AST.ASTNode[] = []
  for (const value of Object.values(node)) {
    const items = Array.isArray(value)
      ? value
      : isNode(value)
        ? [value]
        : isObject(value)
          ? Object.values(value)
          : []
    for (const item of items) {
      if (isNode(item)) {
        result.push(item)
      }
    }
  }
  return result
}

function childKey(key: string, segment: string | number): string {
  return `${key}\u0000${segment}`
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}

function isWordCharacter(c: string): boolean {
  return (
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9') ||
    c === '_' ||
    c === '$'
  )
}
