import type { Side } from './side'

export interface LineChange {
  type: 'unchanged' | 'added' | 'removed'
  value: string
  // Index into the before lines when removed, the after lines otherwise.
  line: number
}

// A before line and an after line known to hold the same thing.
export type Anchor = [number, number]

// If a line changed on one side, the line anchored to it changed on the other
// side too: `f(a, b)` becoming `f(a)` removes only `b`, but both lines differ.
// Anchors chain, so every line connected to a changed one is changed.
export function closeChangedLines(
  before: Side,
  after: Side,
  anchors: Anchor[],
): void {
  const offset = before.lines.length
  const parent = new Int32Array(offset + after.lines.length)
  for (let i = 0; i < parent.length; i++) {
    parent[i] = i
  }
  const find = (start: number) => {
    let i = start
    while (parent[i] !== i) {
      parent[i] = parent[parent[i] as number] as number
      i = parent[i] as number
    }
    return i
  }
  for (const [b, a] of anchors) {
    parent[find(b)] = find(offset + a)
  }
  const changed = new Uint8Array(parent.length)
  changed.set(before.changed)
  changed.set(after.changed, offset)
  const changedRoot = new Uint8Array(parent.length)
  for (let i = 0; i < parent.length; i++) {
    if (changed[i] === 1) changedRoot[find(i)] = 1
  }
  for (let i = 0; i < parent.length; i++) {
    changed[i] = changedRoot[find(i)] as number
  }
  before.changed.set(changed.subarray(0, offset))
  after.changed.set(changed.subarray(offset))
}

// Unchanged lines come from the after side, removed lines are placed among
// them.
export function renderLines(
  before: Side,
  after: Side,
  anchors: Anchor[],
): LineChange[] {
  const removedBefore = placeRemovedLines(
    before.changed,
    anchors,
    after.lines.length,
  )
  const result: LineChange[] = []
  for (let a = 0; a <= after.lines.length; a++) {
    for (const b of removedBefore[a] as number[]) {
      result.push({
        type: 'removed',
        value: before.lines[b] as string,
        line: b,
      })
    }
    if (a < after.lines.length) {
      const type = after.changed[a] === 1 ? 'added' : 'unchanged'
      result.push({ type, value: after.lines[a] as string, line: a })
    }
  }
  return result
}

// A run of removed lines goes before the first after line anchored to any of
// them, so an old header lands next to its new one. A run anchored to nothing
// goes right after the after line anchored to the closest line above it.
// Bucketing by position keeps a moved declaration's old lines next to its
// new ones instead of where they used to be.
function placeRemovedLines(
  beforeChanged: Uint8Array,
  anchors: Anchor[],
  afterCount: number,
): number[][] {
  const first = new Int32Array(beforeChanged.length).fill(-1)
  const last = new Int32Array(beforeChanged.length).fill(-1)
  for (const [b, a] of anchors) {
    if (first[b] === -1 || a < (first[b] as number)) first[b] = a
    if (a > (last[b] as number)) last[b] = a
  }

  const removedBefore: number[][] = []
  for (let a = 0; a <= afterCount; a++) {
    removedBefore.push([])
  }
  let above = 0
  let runStart = -1
  let position = -1
  for (let b = 0; b <= beforeChanged.length; b++) {
    const changed = b < beforeChanged.length && beforeChanged[b] === 1
    if (changed) {
      if (runStart === -1) runStart = b
      const anchored = first[b] as number
      if (anchored !== -1 && (position === -1 || anchored < position)) {
        position = anchored
      }
    } else if (runStart !== -1) {
      const bucket = removedBefore[position === -1 ? above : position]
      for (let removed = runStart; removed < b; removed++) {
        ;(bucket as number[]).push(removed)
      }
      runStart = -1
      position = -1
    }
    if (b < beforeChanged.length && last[b] !== -1) {
      above = (last[b] as number) + 1
    }
  }
  return removedBefore
}
