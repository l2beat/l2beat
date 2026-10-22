import {
  type EditorState,
  type Range,
  StateEffect,
  StateField,
} from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  WidgetType,
} from '@codemirror/view'
import { assert } from '@l2beat/shared-pure'
import type { LineRange, LineRangeMapping } from './utils/diffFilter'

// Like Monaco's hidden unchanged regions: three lines of context around a
// change, and only runs of at least three lines get hidden.
const CONTEXT_LINES = 3
const MIN_HIDDEN_LINES = 3

// Unchanged regions are paired by index, so expanding one side expands the
// same region on the other, even where a filtered out change made the two
// sides of a region differ in length.
export interface UnchangedRegion {
  original: LineRange
  modified: LineRange
}

interface LinePair {
  original: number
  modified: number
}

// Context is counted in lines that sit level on both sides, so the shown
// context matches across the sides, and a filtered out range with sides of
// different lengths is either hidden whole or shown whole. A range at the
// end of the hidden part stays shown, because its padding belongs to the
// line below it.
export function collapsibleRegions(
  lineChanges: LineRangeMapping[],
  gaps: LineRangeMapping[],
  originalLineCount: number,
  modifiedLineCount: number,
): UnchangedRegion[] {
  const regions: UnchangedRegion[] = []
  let start: LinePair = { original: 1, modified: 1 }
  let gapIndex = 0
  for (let index = 0; index <= lineChanges.length; index++) {
    const change = lineChanges[index]
    const end: LinePair = {
      original: change?.original.startLineNumber ?? originalLineCount + 1,
      modified: change?.modified.startLineNumber ?? modifiedLineCount + 1,
    }
    const inside: LineRangeMapping[] = []
    while (gapIndex < gaps.length && endsBefore(gaps[gapIndex], end)) {
      inside.push(gaps[gapIndex] as LineRangeMapping)
      gapIndex++
    }
    const hiddenStart = skipForward(
      start,
      inside,
      index === 0 ? 0 : CONTEXT_LINES,
    )
    const hiddenEnd = skipBackward(
      end,
      inside,
      change === undefined ? 0 : CONTEXT_LINES,
    )
    const region = {
      original: lineRange(hiddenStart.original, hiddenEnd.original),
      modified: lineRange(hiddenStart.modified, hiddenEnd.modified),
    }
    if (
      lineCount(region.original) >= MIN_HIDDEN_LINES &&
      lineCount(region.modified) >= MIN_HIDDEN_LINES
    ) {
      regions.push(region)
    }
    if (change !== undefined) {
      start = {
        original: change.original.endLineNumberExclusive,
        modified: change.modified.endLineNumberExclusive,
      }
    }
  }
  return regions
}

function endsBefore(gap: LineRangeMapping | undefined, end: LinePair) {
  return (
    gap !== undefined &&
    gap.original.endLineNumberExclusive <= end.original &&
    gap.modified.endLineNumberExclusive <= end.modified
  )
}

function skipForward(
  start: LinePair,
  gaps: LineRangeMapping[],
  levelLines: number,
): LinePair {
  let position = start
  let remaining = levelLines
  for (const gap of gaps) {
    const level = gap.original.startLineNumber - position.original
    assert(
      level === gap.modified.startLineNumber - position.modified,
      'Gap off level',
    )
    if (level >= remaining) {
      break
    }
    remaining -= level
    position = {
      original: gap.original.endLineNumberExclusive,
      modified: gap.modified.endLineNumberExclusive,
    }
  }
  return {
    original: position.original + remaining,
    modified: position.modified + remaining,
  }
}

function skipBackward(
  end: LinePair,
  gaps: LineRangeMapping[],
  levelLines: number,
): LinePair {
  let position = end
  let remaining = levelLines
  for (let index = gaps.length - 1; index >= 0; index--) {
    const gap = gaps[index] as LineRangeMapping
    const level = position.original - gap.original.endLineNumberExclusive
    assert(
      level === position.modified - gap.modified.endLineNumberExclusive,
      'Gap off level',
    )
    if (level > remaining) {
      break
    }
    remaining -= level
    position = {
      original: gap.original.startLineNumber,
      modified: gap.modified.startLineNumber,
    }
  }
  return {
    original: position.original - remaining,
    modified: position.modified - remaining,
  }
}

function lineRange(start: number, endExclusive: number): LineRange {
  return { startLineNumber: start, endLineNumberExclusive: endExclusive }
}

function lineCount(range: LineRange): number {
  return range.endLineNumberExclusive - range.startLineNumber
}

const setCollapsed = StateEffect.define<DecorationSet>()
const expandRegion = StateEffect.define<number>()

const collapsedField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(collapsed, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(setCollapsed)) {
        collapsed = effect.value
      } else if (effect.is(expandRegion)) {
        collapsed = collapsed.update({
          filter: (_from, _to, decoration) =>
            decoration.spec.regionIndex !== effect.value,
        })
      }
    }
    return collapsed
  },
  provide: (field) => EditorView.decorations.from(field),
})

export const collapseUnchanged = collapsedField

class CollapsedLinesWidget extends WidgetType {
  constructor(
    readonly regionIndex: number,
    readonly hiddenLineCount: number,
    readonly onExpand: (regionIndex: number) => void,
  ) {
    super()
  }

  override eq(other: CollapsedLinesWidget) {
    return (
      other.regionIndex === this.regionIndex &&
      other.hiddenLineCount === this.hiddenLineCount
    )
  }

  override toDOM() {
    const element = document.createElement('div')
    element.className = 'cm-collapsedLines'
    element.textContent = `${this.hiddenLineCount} unchanged lines`
    element.addEventListener('click', () => this.onExpand(this.regionIndex))
    return element
  }

  override ignoreEvent(event: Event) {
    return event instanceof MouseEvent
  }
}

export function collapseEffect(
  state: EditorState,
  regions: UnchangedRegion[],
  side: 'original' | 'modified',
  onExpand: (regionIndex: number) => void,
): StateEffect<DecorationSet> {
  const decorations: Range<Decoration>[] = []
  for (const [regionIndex, region] of regions.entries()) {
    const range = region[side]
    const from = state.doc.line(range.startLineNumber).from
    const to = state.doc.line(range.endLineNumberExclusive - 1).to
    decorations.push(
      Decoration.replace({
        widget: new CollapsedLinesWidget(
          regionIndex,
          lineCount(range),
          onExpand,
        ),
        block: true,
        regionIndex,
      }).range(from, to),
    )
  }
  return setCollapsed.of(Decoration.set(decorations))
}

export function expandEffect(regionIndex: number): StateEffect<number> {
  return expandRegion.of(regionIndex)
}

export function clearCollapseEffect(): StateEffect<DecorationSet> {
  return setCollapsed.of(Decoration.none)
}
