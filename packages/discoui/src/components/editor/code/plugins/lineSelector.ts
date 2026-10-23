import type { EditorView } from '@codemirror/view'
import type { EditorPlugin } from '../../plugin'
import {
  getSelectedLines,
  nextSelectedLines,
  type SelectedLines,
  scrollToSelectedLines,
  selectedLines,
  setSelectedLines,
} from '../../selectedLines'

export type LineSelection = SelectedLines

type LineSelectionListener = (selection: LineSelection | null) => void

export class LineSelector implements EditorPlugin {
  readonly extension = selectedLines({
    onLineNumberClick: (view, lineNumber, shiftKey) => {
      this.setSelection(
        nextSelectedLines(getSelectedLines(view), lineNumber, shiftKey),
      )
    },
    onContentClick: () => this.clearSelection(),
  })
  private selectionChangeListeners: LineSelectionListener[] = []

  static encode(selection: LineSelection): string {
    if (selection.startLine === selection.endLine) {
      return `${selection.startLine}`
    }
    return `${selection.startLine}-${selection.endLine}`
  }

  static decode(encoded: string): LineSelection | null {
    const match = encoded.match(/^(\d+)(?:-(\d+))?$/)
    if (!match) {
      return null
    }

    // biome-ignore lint/style/noNonNullAssertion: we checked match[2] exists
    const startLine = Number.parseInt(match[1]!, 10)
    // biome-ignore lint/style/noNonNullAssertion: we checked match[3] exists
    const endLine = match[2] ? Number.parseInt(match[2]!, 10) : startLine

    return { startLine, endLine, anchorLine: endLine }
  }

  constructor(readonly view: EditorView) {}

  dispose() {
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
    this.view.dispatch({ effects: setSelectedLines.of(selection) })
    this.selectionChangeListeners.forEach((listener) => {
      listener(selection)
    })
  }

  scrollToSelection() {
    scrollToSelectedLines(this.view)
  }

  clearSelection() {
    this.setSelection(null)
  }
}
