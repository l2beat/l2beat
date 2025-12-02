import * as monaco from 'monaco-editor'
import type { ToMonaco } from '../../monacoInit'
import type { EditorPlugin } from '../../pluginStore'

type ForType = 'code'

export class RangeHighlightPlugin implements EditorPlugin<ForType> {
  private highlightTimeout: NodeJS.Timeout | null = null
  private decorationsCollection: monaco.editor.IEditorDecorationsCollection | null =
    null

  constructor(readonly editor: ToMonaco<ForType>) {}

  activate() {}

  dispose() {
    if (this.highlightTimeout !== null) {
      clearTimeout(this.highlightTimeout)
      this.highlightTimeout = null
    }

    this.clearHighlight()
  }

  showRange(
    startOffset: number,
    length: number,
    options?: {
      highlight?: boolean
      highlightDuration?: number
    },
  ) {
    const model = this.editor.getModel()
    if (model !== null) {
      const start = model.getPositionAt(startOffset)
      const end = model.getPositionAt(startOffset + length)
      const range = {
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column,
      }

      this.clearHighlight()
      this.editor.revealRangeInCenter(range)

      if (!options?.highlight) {
        return
      }

      this.decorationsCollection = this.editor.createDecorationsCollection([
        {
          range: new monaco.Range(
            range.startLineNumber,
            range.startColumn,
            range.endLineNumber,
            range.endColumn,
          ),
          options: {
            className: 'bg-coffee-600 border-2 border-aux-amber rounded',
          },
        },
      ])

      const duration = options?.highlightDuration ?? 3000

      if (this.highlightTimeout !== null) {
        clearTimeout(this.highlightTimeout)
      }

      this.highlightTimeout = setTimeout(() => {
        this.highlightTimeout = null
        this.clearHighlight()
      }, duration)
    }
  }

  clearHighlight() {
    if (this.decorationsCollection) {
      this.decorationsCollection.clear()
      this.decorationsCollection = null
    }
  }
}
