import * as monaco from 'monaco-editor'
import type { ToMonaco } from '../../monacoInit'
import type { EditorPlugin } from '../../pluginStore'

export interface LineSelection {
  startLine: number
  endLine: number
  anchorLine: number
}

type LineSelectionListener = (selection: LineSelection | null) => void

type ForType = 'code'
export class LineSelector implements EditorPlugin<ForType> {
  private selectedLines: LineSelection | null = null
  private decorationIds: string[] = []
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

  constructor(readonly editor: ToMonaco<'code'>) {}

  activate() {
    this.setupLineSelectionHandlers()
  }

  dispose() {
    this.decorationIds = []
    this.selectionChangeListeners = []
  }

  onSelectionChange(listener: (selection: LineSelection | null) => void) {
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
    this.updateLineDecorations()
    this.notifySelectionChange()
  }

  scrollToSelection() {
    if (!this.selectedLines) {
      return
    }

    const range = new monaco.Range(
      this.selectedLines.startLine,
      1,
      this.selectedLines.endLine,
      1,
    )

    this.editor.revealRangeInCenter(range)
  }

  clearSelection() {
    this.selectedLines = null
    this.updateLineDecorations()
    this.notifySelectionChange()
  }

  private setupLineSelectionHandlers() {
    this.editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        this.handleLineClick(
          e.target.position?.lineNumber ?? 0,
          e.event.shiftKey,
        )
      } else {
        this.clearSelection()
      }
    })
  }

  private handleLineClick(lineNumber: number, shiftKey: boolean) {
    if (!lineNumber) {
      return
    }

    if (!this.selectedLines || !shiftKey) {
      this.selectedLines = {
        startLine: lineNumber,
        endLine: lineNumber,
        anchorLine: lineNumber,
      }
    } else {
      this.selectedLines = {
        startLine: Math.min(this.selectedLines.anchorLine, lineNumber),
        endLine: Math.max(this.selectedLines.anchorLine, lineNumber),
        anchorLine: lineNumber,
      }
    }

    this.updateLineDecorations()
    this.notifySelectionChange()
  }

  private notifySelectionChange() {
    this.selectionChangeListeners.forEach((listener) => {
      listener(this.selectedLines)
    })
  }

  private updateLineDecorations() {
    this.decorationIds = this.editor.deltaDecorations(this.decorationIds, [])

    if (!this.selectedLines) {
      return
    }

    const decorations: monaco.editor.IModelDeltaDecoration[] = []
    const isMultiLine =
      this.selectedLines.startLine !== this.selectedLines.endLine

    for (
      let line = this.selectedLines.startLine;
      line <= this.selectedLines.endLine;
      line++
    ) {
      let className = 'selected-line-highlight'

      if (!isMultiLine) {
        className = 'selected-line-highlight-single'
      } else if (line === this.selectedLines.startLine) {
        className = 'selected-line-highlight-first'
      } else if (line === this.selectedLines.endLine) {
        className = 'selected-line-highlight-last'
      }

      decorations.push({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className,
          marginClassName: 'selected-line-margin',
        },
      })
    }

    this.decorationIds = this.editor.deltaDecorations([], decorations)
  }
}
