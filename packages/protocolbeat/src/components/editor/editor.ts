import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { jsonDiagnostics } from './languages/json'
import * as solidity from './languages/solidity'
import type { EditorFile } from './store'
import { theme } from './theme'

let initialized = false

export type EditorSupportedLanguage = 'solidity' | 'json'

export type EditorCallbacks = {
  onSave?: (content: string) => string
  onChange?: (content: string) => void
}

export class Editor {
  private readonly editor: monaco.editor.IStandaloneCodeEditor
  private models: Record<string, editor.IModel | null> = {}
  private viewStates: Record<string, editor.ICodeEditorViewState | null> = {}
  private highlightTimeout: NodeJS.Timeout | null = null
  private decorationsCollection: monaco.editor.IEditorDecorationsCollection | null =
    null
  private disposed = false

  private onSaveCallback: ((content: string) => string) | null = null
  private onChangeCallback: ((content: string) => void) | null = null

  constructor(element: HTMLElement) {
    if (!initialized) {
      init()
      initialized = true
    }

    this.editor = monaco.editor.create(element, {
      minimap: { enabled: false },
      readOnly: true,
      colorDecorators: false,
      renderWhitespace: 'none',
      renderControlCharacters: false,
      fontFamily:
        "ui-monospace, Menlo, Monaco, 'Cascadia Code', 'Source Code Pro', Consolas, 'DejaVu Sans Mono', monospace",
      // @ts-expect-error Thanks you Microsoft
      'bracketPairColorization.enabled': false,
      model: null, // Prevent Monaco from creating a default model
    })

    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (this.onSaveCallback) {
        const model = this.editor.getModel()
        if (model === null) {
          return
        }
        const value = model.getValue()
        const newValue = this.onSaveCallback(value)
        if (newValue !== value) {
          this.saveViewState()
          model.setValue(newValue)
          this.restoreViewState()
        }
      }
    })

    this.editor.onDidChangeModelContent(() => {
      if (this.onChangeCallback) {
        const value = this.editor.getModel()?.getValue() ?? ''
        this.onChangeCallback(value)
      }
    })
  }

  private createUri(file: EditorFile) {
    return monaco.Uri.parse(`inmemory://${file.id}.${file.language}`)
  }

  setFile(file: EditorFile) {
    this.saveViewState()
    const model = this.getOrCreateFileModel(file)

    this.editor.updateOptions({
      readOnly: file.readOnly,
    })

    this.editor.setModel(model)
    this.restoreViewState()
  }

  onSave(onSaveCallback: (content: string) => string) {
    this.onSaveCallback = onSaveCallback
  }

  detachListeners() {
    this.onSaveCallback = null
    this.onChangeCallback = null
  }

  onChange(onChangeCallback: (content: string) => void) {
    this.onChangeCallback = onChangeCallback
  }

  private getOrCreateFileModel(file: EditorFile) {
    const uri = this.createUri(file).toString()
    const existingModel = this.models[uri]

    if (!existingModel) {
      return this.addFile(file)
    }

    const currentContent = existingModel.getLinesContent().join('\n')
    if (currentContent === file.content) {
      return existingModel
    }

    existingModel.setValue(file.content)

    return existingModel
  }

  private addFile(file: EditorFile) {
    const uri = this.createUri(file)
    const model = monaco.editor.createModel(file.content, file.language, uri)
    this.models[uri.toString()] = model

    return model
  }

  private saveViewState() {
    const model = this.editor.getModel()
    if (model === null) {
      return
    }

    this.viewStates[model.uri.toString()] = this.editor.saveViewState()
  }

  private restoreViewState() {
    const model = this.editor.getModel()
    if (model === null) {
      return
    }

    this.editor.restoreViewState(this.viewStates[model.uri.toString()] ?? null)
  }

  showRange(
    startOffset: number,
    length: number,
    options?: {
      highlight?: boolean
      highlightDuration?: number
    },
  ) {
    if (this.disposed) {
      console.warn('Cannot show range on disposed editor')
      return
    }
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
      this.editor.setSelection(range)

      if (options?.highlight !== false) {
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
        if (duration > 0) {
          if (this.highlightTimeout !== null) {
            clearTimeout(this.highlightTimeout)
          }

          this.highlightTimeout = setTimeout(() => {
            this.highlightTimeout = null
            this.clearHighlight()
          }, duration)
        }
      }
    }
  }

  clearHighlight() {
    if (this.decorationsCollection) {
      this.decorationsCollection.clear()
      this.decorationsCollection = null
    }
  }

  resize() {
    if (this.disposed) {
      return
    }
    this.editor.layout()
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.disposed = true

    // Clear any pending highlight timeout
    if (this.highlightTimeout !== null) {
      clearTimeout(this.highlightTimeout)
      this.highlightTimeout = null
    }

    // Clear decorations
    this.clearHighlight()

    // Dispose all models
    Object.values(this.models).forEach((model) => {
      if (model) {
        model.dispose()
      }
    })
    this.models = {}
    this.viewStates = {}

    // Dispose the editor instance
    this.editor.dispose()
  }
}

function init() {
  self.MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      if (label === 'editorWorkerService') {
        return new editorWorker()
      }
      if (label === 'json') {
        return new jsonWorker()
      }
      console.error('Unknown worker type!', label)
      return new editorWorker()
    },
  }

  monaco.languages.register({ id: 'solidity' })
  monaco.languages.setMonarchTokensProvider('solidity', solidity.language)
  monaco.languages.setLanguageConfiguration('solidity', solidity.configuration)

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions(jsonDiagnostics)

  monaco.editor.defineTheme('default', theme)
  monaco.editor.setTheme('default')
}
