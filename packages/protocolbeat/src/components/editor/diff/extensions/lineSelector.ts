import * as monaco from 'monaco-editor'

export interface LineSelection {
  side: 'left' | 'right'
  startLine: number
  endLine: number
  anchorLine: number
}

export class LineSelector {
  private editor: monaco.editor.IStandaloneDiffEditor

  private selectedLines: LineSelection | null = null
  private leftDecorationIds: string[] = []
  private rightDecorationIds: string[] = []
  private selectionChangeListeners: Array<
    (selection: LineSelection | null) => void
  > = []

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

  constructor(editor: monaco.editor.IStandaloneDiffEditor) {
    this.editor = editor
  }

  init() {
    this.setupLineSelectionHandlers()
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

    const { side } = this.selectedLines

    const editor =
      side === 'left'
        ? this.editor.getOriginalEditor()
        : this.editor.getModifiedEditor()

    const range = new monaco.Range(
      this.selectedLines.startLine,
      1,
      this.selectedLines.endLine,
      1,
    )

    editor.revealRangeInCenter(range)
  }

  clearSelection() {
    this.selectedLines = null
    this.updateLineDecorations()
    this.notifySelectionChange()
  }

  private setupLineSelectionHandlers() {
    const editors = [
      {
        key: 'left',
        editor: this.editor.getOriginalEditor(),
      },
      {
        key: 'right',
        editor: this.editor.getModifiedEditor(),
      },
    ] as const

    for (const editor of editors) {
      editor.editor.onMouseDown((e) => {
        if (
          e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS
        ) {
          this.handleLineClick(
            editor.key,
            e.target.position?.lineNumber ?? 0,
            e.event.shiftKey,
          )
        } else {
          this.clearSelection()
        }
      })
    }
  }

  private handleLineClick(
    side: 'left' | 'right',
    lineNumber: number,
    shiftKey: boolean,
  ) {
    if (!lineNumber) {
      return
    }

    if (!this.selectedLines || !shiftKey || this.selectedLines.side !== side) {
      this.selectedLines = {
        side,
        startLine: lineNumber,
        endLine: lineNumber,
        anchorLine: lineNumber,
      }
    } else {
      this.selectedLines = {
        side,
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
    this.leftDecorationIds = this.editor
      .getOriginalEditor()
      .deltaDecorations(this.leftDecorationIds, [])
    this.rightDecorationIds = this.editor
      .getModifiedEditor()
      .deltaDecorations(this.rightDecorationIds, [])

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

    if (this.selectedLines.side === 'left') {
      this.leftDecorationIds = this.editor
        .getOriginalEditor()
        .deltaDecorations([], decorations)
    } else {
      this.rightDecorationIds = this.editor
        .getModifiedEditor()
        .deltaDecorations([], decorations)
    }
  }

  dispose() {
    this.leftDecorationIds = []
    this.rightDecorationIds = []
    this.selectionChangeListeners = []
  }
}
