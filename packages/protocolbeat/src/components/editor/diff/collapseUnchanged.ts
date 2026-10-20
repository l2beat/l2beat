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

export function collapsibleRegions(
  lineChanges: LineRangeMapping[],
  originalLineCount: number,
  modifiedLineCount: number,
): UnchangedRegion[] {
  const regions: UnchangedRegion[] = []
  let original = 1
  let modified = 1
  for (let index = 0; index <= lineChanges.length; index++) {
    const change = lineChanges[index]
    const isFirst = index === 0
    const isLast = change === undefined
    const region = {
      original: hiddenPart(
        original,
        change?.original.startLineNumber ?? originalLineCount + 1,
        isFirst,
        isLast,
      ),
      modified: hiddenPart(
        modified,
        change?.modified.startLineNumber ?? modifiedLineCount + 1,
        isFirst,
        isLast,
      ),
    }
    if (
      lineCount(region.original) >= MIN_HIDDEN_LINES &&
      lineCount(region.modified) >= MIN_HIDDEN_LINES
    ) {
      regions.push(region)
    }
    if (change !== undefined) {
      original = change.original.endLineNumberExclusive
      modified = change.modified.endLineNumberExclusive
    }
  }
  return regions
}

function hiddenPart(
  start: number,
  endExclusive: number,
  isFirst: boolean,
  isLast: boolean,
): LineRange {
  return {
    startLineNumber: isFirst ? start : start + CONTEXT_LINES,
    endLineNumberExclusive: isLast
      ? endExclusive
      : endExclusive - CONTEXT_LINES,
  }
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
