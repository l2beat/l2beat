import { MergeView } from '@codemirror/merge'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import {
  EditorState,
  type Extension,
  type Range,
  RangeSet,
  type Text,
} from '@codemirror/state'
import {
  Decoration,
  drawSelection,
  EditorView,
  GutterMarker,
  gutterLineClass,
  keymap,
  lineNumbers,
} from '@codemirror/view'
import { assert } from '@l2beat/shared-pure'
import { cyrb64 } from '../hashes/cyrb-hash'
import { indentGuides } from '../indentGuides'
import { solidity } from '../languages/solidity'
import {
  type EditorPlugin,
  type EditorPluginClass,
  EditorPluginStore,
} from '../plugin'
import { centeredSearch } from '../search'
import { theme } from '../theme'
import { ChangeStrip } from './changeStrip'
import {
  clearCollapseEffect,
  collapseEffect,
  collapseUnchanged,
  collapsibleRegions,
  expandEffect,
  type UnchangedRegion,
} from './collapseUnchanged'
import { type ComputedDiff, computeDiff } from './computeDiff'
import { diffTheme } from './diffTheme'
import type { LineRange, LineRangeMapping } from './utils/diffFilter'

export interface Change {
  readonly left: [number, number]
  readonly right: [number, number]
}

export interface Diff {
  deletions: number
  additions: number
  changes: Change[]
}

interface Disposable {
  dispose(): void
}

// The merge view diffs once when created and again on edits, so a change to
// the texts or to the comment filter builds a new one. Both happen rarely.
export class DiffEditor {
  private mergeView: MergeView | undefined
  private readonly plugins = new EditorPluginStore<DiffEditor>(this)
  private readonly buildListeners = new Set<() => void>()
  private readonly diffListeners = new Set<(diff: Diff) => void>()
  private readonly strip = new ChangeStrip()
  private texts: { left: string; right: string } | undefined
  private ignoreComments = false
  private folding = false
  private lastDiff: Diff | undefined
  private unchangedRegions: UnchangedRegion[] = []
  // Where each kept change starts on the right side. The merge view's chunks
  // also hold filtered out changes, so navigation goes by these instead.
  private changeStarts: number[] = []
  // Scroll position per pair of texts, to come back to after a toggle.
  private readonly scrollTops = new Map<string, number>()
  private builtTextsKey: string | undefined
  private buildScheduled = false
  private disposed = false

  constructor(private readonly element: HTMLElement) {
    element.append(this.strip.dom)
  }

  get view(): MergeView | undefined {
    return this.mergeView
  }

  usePlugin<V extends EditorPlugin>(clazz: EditorPluginClass<DiffEditor, V>) {
    // Plugins join the views when the merge view is built.
    assert(this.texts === undefined, 'Plugin added after the texts')
    this.plugins.add(clazz)
  }

  getPlugin<V extends EditorPlugin>(clazz: EditorPluginClass<DiffEditor, V>) {
    return this.plugins.get(clazz)
  }

  // Settings arrive one React effect at a time, so the build waits for all
  // of them instead of diffing once per setting.
  setDiff(left: string, right: string) {
    if (this.texts?.left === left && this.texts.right === right) {
      return
    }
    this.texts = { left, right }
    this.scheduleBuild()
  }

  setIgnoreComments(ignoreComments: boolean) {
    if (this.ignoreComments === ignoreComments) {
      return
    }
    this.ignoreComments = ignoreComments
    this.scheduleBuild()
  }

  // Keeps the line at the top of the view in place, or the bar that hides
  // it. Scrolling by position would also scroll sideways to a bar, which is
  // as wide as the longest line.
  setFolding(folding: boolean) {
    this.folding = folding
    const mergeView = this.mergeView
    if (mergeView === undefined) {
      return
    }
    const scroller = mergeView.dom
    const view = mergeView.b
    const topPosition = view.lineBlockAtHeight(
      scroller.getBoundingClientRect().top - view.documentTop,
    ).from
    this.applyFolding()
    view.requestMeasure({
      read: () =>
        view.documentTop -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop +
        view.lineBlockAt(topPosition).top,
      write: (scrollTop) => {
        scroller.scrollTop = scrollTop
      },
    })
  }

  onComputedDiff(listener: (diff: Diff) => void): Disposable {
    this.diffListeners.add(listener)
    if (this.lastDiff !== undefined) {
      listener(this.lastDiff)
    }
    return { dispose: () => this.diffListeners.delete(listener) }
  }

  onBuild(listener: () => void): Disposable {
    this.buildListeners.add(listener)
    return { dispose: () => this.buildListeners.delete(listener) }
  }

  toNextDiff() {
    this.goToChange(1)
  }

  toPreviousDiff() {
    this.goToChange(-1)
  }

  dispose() {
    if (this.disposed) {
      return
    }
    this.disposed = true
    this.diffListeners.clear()
    this.buildListeners.clear()
    this.plugins.dispose()
    this.strip.dispose()
    this.mergeView?.destroy()
    this.mergeView = undefined
  }

  // Moves the cursor of the right side to the next or previous change,
  // wrapping around, and centers it like Monaco does.
  private goToChange(direction: 1 | -1) {
    const mergeView = this.mergeView
    if (mergeView === undefined || this.changeStarts.length === 0) {
      return
    }
    const view = mergeView.b
    const head = view.state.selection.main.head
    const target =
      direction === 1
        ? nextStart(this.changeStarts, head)
        : previousStart(this.changeStarts, head)
    view.dispatch({
      selection: { anchor: target },
      effects: EditorView.scrollIntoView(target, { y: 'center' }),
    })
  }

  private scheduleBuild() {
    if (this.buildScheduled) {
      return
    }
    this.buildScheduled = true
    queueMicrotask(() => {
      this.buildScheduled = false
      if (!this.disposed) {
        this.build()
      }
    })
  }

  private build() {
    const texts = this.texts
    assert(texts !== undefined, 'Build without texts')
    if (this.mergeView && this.builtTextsKey !== undefined) {
      this.scrollTops.set(this.builtTextsKey, this.mergeView.dom.scrollTop)
    }
    this.mergeView?.destroy()
    this.builtTextsKey = cyrb64(cyrb64(texts.left) + cyrb64(texts.right))

    const computed = computeDiff(texts.left, texts.right, this.ignoreComments)
    this.mergeView = new MergeView({
      a: {
        doc: texts.left,
        extensions: this.sideExtensions(
          filteredLines(computed.filteredChanges, 'original', texts.left),
        ),
      },
      b: {
        doc: texts.right,
        extensions: this.sideExtensions(
          filteredLines(computed.filteredChanges, 'modified', texts.right),
        ),
      },
      parent: this.element,
      gutter: true,
      highlightChanges: true,
      diffConfig: {
        override: (left, right) => {
          assert(left === texts.left && right === texts.right, 'Stale diff')
          return computed.textChanges
        },
      },
    })
    const rightDoc = this.mergeView.b.state.doc
    this.changeStarts = computed.lineChanges.map((change) =>
      lineStart(rightDoc, change.modified.startLineNumber),
    )
    this.unchangedRegions = collapsibleRegions(
      computed.lineChanges,
      computed.filteredChanges,
      this.mergeView.a.state.doc.lines,
      this.mergeView.b.state.doc.lines,
    )
    this.strip.attach(this.mergeView, computed.lineChanges)
    this.applyFolding()
    this.mergeView.dom.scrollTop = this.scrollTops.get(this.builtTextsKey) ?? 0

    for (const listener of this.buildListeners) {
      listener()
    }
    this.lastDiff = summarize(computed)
    for (const listener of this.diffListeners) {
      listener(this.lastDiff)
    }
  }

  private applyFolding() {
    const mergeView = this.mergeView
    if (mergeView === undefined) {
      return
    }
    const expand = (regionIndex: number) => {
      mergeView.a.dispatch({ effects: expandEffect(regionIndex) })
      mergeView.b.dispatch({ effects: expandEffect(regionIndex) })
    }
    const sides = [
      [mergeView.a, 'original'],
      [mergeView.b, 'modified'],
    ] as const
    for (const [view, side] of sides) {
      view.dispatch({
        effects: this.folding
          ? collapseEffect(view.state, this.unchangedRegions, side, expand)
          : clearCollapseEffect(),
      })
    }
    this.strip.schedule()
  }

  private sideExtensions(filtered: Extension): Extension {
    return [
      lineNumbers(),
      drawSelection(),
      highlightSelectionMatches({ highlightWordAroundCursor: true }),
      centeredSearch,
      keymap.of(searchKeymap),
      EditorState.readOnly.of(true),
      solidity,
      indentGuides,
      theme,
      diffTheme,
      filtered,
      collapseUnchanged,
      this.strip.extension,
      this.plugins.extensions(),
    ]
  }
}

function lineStart(doc: Text, lineNumber: number): number {
  return lineNumber > doc.lines ? doc.length : doc.line(lineNumber).from
}

function nextStart(starts: number[], position: number): number {
  for (const start of starts) {
    if (start > position) {
      return start
    }
  }
  return starts[0] as number
}

function previousStart(starts: number[], position: number): number {
  for (let index = starts.length - 1; index >= 0; index--) {
    const start = starts[index] as number
    if (start < position) {
      return start
    }
  }
  return starts[starts.length - 1] as number
}

// Monaco's ILineChange shape, which the inline diff copy reads: line numbers
// are inclusive, and an empty side has an end of 0 and a start on the line
// before the change.
function summarize(computed: ComputedDiff): Diff {
  let deletions = 0
  let additions = 0
  const changes: Change[] = []
  for (const change of computed.lineChanges) {
    changes.push({
      left: inclusiveLines(change.original),
      right: inclusiveLines(change.modified),
    })
    deletions += lineCount(change.original)
    additions += lineCount(change.modified)
  }
  return { deletions, additions, changes }
}

function inclusiveLines(range: LineRange): [number, number] {
  if (lineCount(range) === 0) {
    return [range.startLineNumber - 1, 0]
  }
  return [range.startLineNumber, range.endLineNumberExclusive - 1]
}

function lineCount(range: LineRange): number {
  return range.endLineNumberExclusive - range.startLineNumber
}

// Filtered out changes are chunks to the merge view, so it keeps the sides
// aligned around them. Their lines get a class that undoes the change
// highlight.
function filteredLines(
  changes: LineRangeMapping[],
  side: 'original' | 'modified',
  text: string,
): Extension {
  const starts = lineStartOffsets(text)
  const lines: Range<Decoration>[] = []
  const gutterLines: Range<GutterMarker>[] = []
  for (const change of changes) {
    const range = change[side]
    for (
      let line = range.startLineNumber;
      line < range.endLineNumberExclusive;
      line++
    ) {
      const start = starts[line - 1] as number
      lines.push(filteredLine.range(start))
      gutterLines.push(filteredGutterLine.range(start))
    }
  }
  return [
    EditorView.decorations.of(Decoration.set(lines)),
    gutterLineClass.of(RangeSet.of(gutterLines)),
  ]
}

const filteredLine = Decoration.line({ class: 'cm-filteredLine' })

const filteredGutterLine = new (class extends GutterMarker {
  override elementClass = 'cm-filteredLine'
})()

function lineStartOffsets(text: string): number[] {
  const starts: number[] = []
  let start = 0
  for (const line of text.split('\n')) {
    starts.push(start)
    start += line.length + 1
  }
  return starts
}
