import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

import * as solidity from './languages/solidity'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { cyrb64 } from './cyrb-hash'
import { theme } from './theme'

let initialized = false

export type EditorSupportedLanguage = 'solidity' | 'json'

export class Editor {
  private readonly editor: monaco.editor.IStandaloneCodeEditor
  private models: Record<string, editor.IModel | null> = {}
  private viewStates: Record<string, editor.ICodeEditorViewState | null> = {}
  private currentCode: string = ''
  private highlightTimeout: NodeJS.Timeout | null = null
  private decorationsCollection: monaco.editor.IEditorDecorationsCollection | null =
    null

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
  }

  setCode(code: string, language: EditorSupportedLanguage) {
    const staleCodeHash = cyrb64(this.currentCode)
    const currentModel = this.editor.getModel()

    // Only cache the model if it exists and has content
    if (currentModel && this.currentCode.trim() !== '') {
      this.models[staleCodeHash] = currentModel
      this.viewStates[staleCodeHash] = this.editor.saveViewState()
    }

    this.currentCode = code
    const newCodeHash = cyrb64(code)
    if (this.models[newCodeHash] === undefined) {
      const model = monaco.editor.createModel(code, language)
      this.models[newCodeHash] = model
    }

    this.editor.setModel(this.models[newCodeHash] ?? null)
    this.editor.restoreViewState(this.viewStates[newCodeHash] ?? null)
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
    this.editor.layout()
  }

  dispose() {
    Object.values(this.models).forEach((model) => {
      if (model) {
        model.dispose()
      }
    })
    this.models = {}
    this.viewStates = {}

    this.editor.dispose()
  }
}

function init() {
  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      if (label === 'editorWorkerService') {
        return new editorWorker()
      }
      console.error('Unknown worker type!', label)
      return new editorWorker()
    },
  }

  monaco.languages.register({ id: 'solidity' })
  monaco.languages.setMonarchTokensProvider('solidity', solidity.language)
  monaco.languages.setLanguageConfiguration('solidity', solidity.configuration)

  monaco.editor.defineTheme('default', theme)
  monaco.editor.setTheme('default')
}
