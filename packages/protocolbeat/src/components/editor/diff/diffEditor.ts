import { type Chunk, MergeView } from '@codemirror/merge'
import {
  highlightSelectionMatches,
  search,
  searchKeymap,
} from '@codemirror/search'
import { EditorState, type Extension, type Range } from '@codemirror/state'
import {
  Decoration,
  drawSelection,
  EditorView,
  keymap,
  lineNumbers,
  WidgetType,
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
import { theme } from '../theme'
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
  private texts: { left: string; right: string } | undefined
  private ignoreComments = false
  private folding = false
  private lastDiff: Diff | undefined
  private unchangedRegions: UnchangedRegion[] = []
  // Scroll position per pair of texts, to come back to after a toggle.
  private readonly scrollTops = new Map<string, number>()
  private builtTextsKey: string | undefined
  private buildScheduled = false
  private disposed = false

  constructor(private readonly element: HTMLElement) {}

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

  setFolding(folding: boolean) {
    this.folding = folding
    this.applyFolding()
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
    this.goToChunk(1)
  }

  toPreviousDiff() {
    this.goToChunk(-1)
  }

  dispose() {
    if (this.disposed) {
      return
    }
    this.disposed = true
    this.diffListeners.clear()
    this.buildListeners.clear()
    this.plugins.dispose()
    this.mergeView?.destroy()
    this.mergeView = undefined
  }

  // Moves the cursor of the right side to the next or previous change,
  // wrapping around, and centers it like Monaco does.
  private goToChunk(direction: 1 | -1) {
    const mergeView = this.mergeView
    if (mergeView === undefined || mergeView.chunks.length === 0) {
      return
    }
    const view = mergeView.b
    const head = view.state.selection.main.head
    const chunk =
      direction === 1
        ? nextChunk(mergeView.chunks, head)
        : previousChunk(mergeView.chunks, head)
    view.dispatch({
      selection: { anchor: chunk.fromB },
      effects: EditorView.scrollIntoView(chunk.fromB, { y: 'center' }),
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
          gapDecorations(computed.alignmentGaps, 'original', texts.left),
        ),
      },
      b: {
        doc: texts.right,
        extensions: this.sideExtensions(
          gapDecorations(computed.alignmentGaps, 'modified', texts.right),
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
    this.unchangedRegions = collapsibleRegions(
      computed.lineChanges,
      this.mergeView.a.state.doc.lines,
      this.mergeView.b.state.doc.lines,
    )
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
  }

  private sideExtensions(gaps: Extension): Extension {
    return [
      lineNumbers(),
      drawSelection(),
      highlightSelectionMatches({ highlightWordAroundCursor: true }),
      search({ top: true }),
      keymap.of(searchKeymap),
      EditorState.readOnly.of(true),
      solidity,
      indentGuides,
      theme,
      diffTheme,
      gaps,
      collapseUnchanged,
      this.plugins.extensions(),
    ]
  }
}

function nextChunk(chunks: readonly Chunk[], position: number): Chunk {
  for (const chunk of chunks) {
    if (chunk.fromB > position) {
      return chunk
    }
  }
  return chunks[0] as Chunk
}

function previousChunk(chunks: readonly Chunk[], position: number): Chunk {
  for (let index = chunks.length - 1; index >= 0; index--) {
    const chunk = chunks[index] as Chunk
    if (chunk.fromB < position) {
      return chunk
    }
  }
  return chunks[chunks.length - 1] as Chunk
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

class GapWidget extends WidgetType {
  constructor(readonly lineCount: number) {
    super()
  }

  override eq(other: GapWidget) {
    return other.lineCount === this.lineCount
  }

  override toDOM(view: EditorView) {
    const element = document.createElement('div')
    element.className = 'cm-diff-gap'
    element.style.height = `${this.lineCount * view.defaultLineHeight}px`
    return element
  }
}

// For each filtered out range, pads the side with fewer lines below it, so
// the lines after it stay level with their counterparts. The merge view
// aligns by measured heights, so it keeps these instead of undoing them.
function gapDecorations(
  gaps: LineRangeMapping[],
  side: 'original' | 'modified',
  text: string,
): Extension {
  const other = side === 'original' ? 'modified' : 'original'
  const lineEnds = lineEndOffsets(text)
  const widgets: Range<Decoration>[] = []
  for (const gap of gaps) {
    const missingLines = lineCount(gap[other]) - lineCount(gap[side])
    if (missingLines <= 0) {
      continue
    }
    const widget = new GapWidget(missingLines)
    const afterLine = Math.min(
      gap[side].endLineNumberExclusive - 1,
      lineEnds.length,
    )
    widgets.push(
      afterLine === 0
        ? Decoration.widget({ widget, block: true, side: -1 }).range(0)
        : Decoration.widget({ widget, block: true, side: 1 }).range(
            lineEnds[afterLine - 1] as number,
          ),
    )
  }
  return EditorView.decorations.of(Decoration.set(widgets, true))
}

function lineEndOffsets(text: string): number[] {
  const ends: number[] = []
  let start = 0
  for (const line of text.split('\n')) {
    ends.push(start + line.length)
    start += line.length + 1
  }
  return ends
}
