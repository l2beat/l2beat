import type { EditorView } from '@codemirror/view'
import { assert } from '@l2beat/shared-pure'
import type { EditorPlugin } from '../../plugin'
import {
  nextSelectedLines,
  scrollToSelectedLines,
  selectedLines,
  setSelectedLines,
} from '../../selectedLines'
import type { DiffEditor } from '../diffEditor'

export interface LineSelection {
  side: 'left' | 'right'
  startLine: number
  endLine: number
  anchorLine: number
}

type LineSelectionListener = (selection: LineSelection | null) => void

// Keeps the selection itself, because the diff editor builds new views when
// its texts or settings change, and the selection carries over to them.
export class LineSelector implements EditorPlugin {
  readonly extension = selectedLines({
    onLineNumberClick: (view, lineNumber, shiftKey) =>
      this.handleLineClick(this.sideOf(view), lineNumber, shiftKey),
    onContentClick: () => this.clearSelection(),
  })
  private selectedLines: LineSelection | null = null
  private selectionChangeListeners: LineSelectionListener[] = []
  private readonly buildSubscription: { dispose(): void }

  static encode(selection: LineSelection): string {
    const prefix = selection.side === 'left' ? 'L' : 'R'
    if (selection.startLine === selection.endLine) {
      return `${prefix}${selection.startLine}`
    }
    return `${prefix}${selection.startLine}-${selection.endLine}`
  }

  static decode(encoded: string): LineSelection | null {
    const match = encoded.match(/^([LR])(\d+)(?:-(\d+))?$/)
    if (!match) {
      return null
    }

    const side = match[1] === 'L' ? 'left' : 'right'
    // biome-ignore lint/style/noNonNullAssertion: we checked match[2] exists
    const startLine = Number.parseInt(match[2]!, 10)
    // biome-ignore lint/style/noNonNullAssertion: we checked match[3] exists
    const endLine = match[3] ? Number.parseInt(match[3]!, 10) : startLine

    return { side, startLine, endLine, anchorLine: endLine }
  }

  constructor(readonly editor: DiffEditor) {
    this.buildSubscription = editor.onBuild(() => this.render())
  }

  dispose() {
    this.buildSubscription.dispose()
    this.selectionChangeListeners = []
  }

  onSelectionChange(listener: LineSelectionListener) {
    this.selectionChangeListeners.push(listener)

    return () => {
      const index = this.selectionChangeListeners.indexOf(listener)
      if (index > -1) {
        this.selectionChangeListeners.splice(index, 1)
      }
    }
  }

  setSelection(selection: LineSelection | null) {
    this.selectedLines = selection
    this.render()
    this.selectionChangeListeners.forEach((listener) => {
      listener(this.selectedLines)
    })
  }

  scrollToSelection() {
    const mergeView = this.editor.view
    if (!this.selectedLines || mergeView === undefined) {
      return
    }
    scrollToSelectedLines(
      this.selectedLines.side === 'left' ? mergeView.a : mergeView.b,
    )
  }

  clearSelection() {
    this.setSelection(null)
  }

  private handleLineClick(
    side: 'left' | 'right',
    lineNumber: number,
    shiftKey: boolean,
  ) {
    const current =
      this.selectedLines?.side === side ? this.selectedLines : null
    this.setSelection({
      side,
      ...nextSelectedLines(current, lineNumber, shiftKey),
    })
  }

  private sideOf(view: EditorView): 'left' | 'right' {
    const mergeView = this.editor.view
    assert(mergeView !== undefined, 'Click without a merge view')
    if (view === mergeView.a) {
      return 'left'
    }
    assert(view === mergeView.b, 'Click in a view of another editor')
    return 'right'
  }

  private render() {
    const mergeView = this.editor.view
    if (mergeView === undefined) {
      return
    }
    const selection = this.selectedLines
    mergeView.a.dispatch({
      effects: setSelectedLines.of(
        selection?.side === 'left' ? selection : null,
      ),
    })
    mergeView.b.dispatch({
      effects: setSelectedLines.of(
        selection?.side === 'right' ? selection : null,
      ),
    })
  }
}
