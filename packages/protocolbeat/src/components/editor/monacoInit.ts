import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'
// @ts-expect-error - internal Monaco module, not in public types
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'

import { getSharedDiffProvider } from './diff/customDiffProvider'
import { jsonDiagnostics } from './languages/json'
import * as solidity from './languages/solidity'
import { theme } from './theme'

let initialized = false

const customDiffProviderFactory = {
  createDiffProvider(_options: unknown) {
    return getSharedDiffProvider()
  },
}

const serviceOverrides = {
  diffProviderFactoryService: customDiffProviderFactory,
}

export type EditorType = 'code' | 'diff'
export type ToMonaco<T> = T extends 'code'
  ? monaco.editor.IStandaloneCodeEditor
  : T extends 'diff'
    ? monaco.editor.IStandaloneDiffEditor
    : never

// Compatible with diff options
const settings: monaco.editor.IStandaloneEditorConstructionOptions = {
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
}

export class MonacoCodeEditor<T extends EditorType> {
  protected editor: ToMonaco<T>
  protected callbacks: monaco.IDisposable[] = []

  constructor(element: HTMLElement, editorType: T) {
    if (!initialized) {
      init()
      initialized = true
    }
    if (editorType === 'code') {
      this.editor = monaco.editor.create(element, settings) as ToMonaco<T>
    } else {
      this.editor = monaco.editor.createDiffEditor(
        element,
        settings,
      ) as ToMonaco<T>
    }
  }

  setJsonDiagnostics(diagnostics: monaco.languages.json.DiagnosticsOptions) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions(diagnostics)
  }

  getJsonDiagnostics() {
    return monaco.languages.json.jsonDefaults.diagnosticsOptions
  }

  upsertJsonSchema(schemaConfig: {
    uri: string
    fileMatch?: string[]
    schema?: unknown
  }) {
    const currentDiagnostics = this.getJsonDiagnostics()
    const currentSchemas = currentDiagnostics.schemas ?? []

    const filteredSchemas = currentSchemas.filter(
      (s) => s.uri !== schemaConfig.uri,
    )

    const updatedSchemas = [...filteredSchemas, schemaConfig]

    this.setJsonDiagnostics({
      ...currentDiagnostics,
      schemas: updatedSchemas,
    })
  }

  removeJsonSchema(uri: string) {
    const currentDiagnostics = this.getJsonDiagnostics()
    const currentSchemas = currentDiagnostics.schemas ?? []

    const filteredSchemas = currentSchemas.filter((s) => s.uri !== uri)

    this.setJsonDiagnostics({
      ...currentDiagnostics,
      schemas: filteredSchemas,
    })
  }

  // Wraps a Monaco disposable so the caller can dispose it directly *and*
  // we still clean it up on full editor disposal if the caller never did.
  protected trackDisposable(
    disposable: monaco.IDisposable,
  ): monaco.IDisposable {
    this.callbacks.push(disposable)
    return {
      dispose: () => {
        const index = this.callbacks.indexOf(disposable)
        if (index !== -1) {
          this.callbacks.splice(index, 1)
        }
        disposable.dispose()
      },
    }
  }

  protected disposeCallbacks() {
    for (const callback of this.callbacks) {
      callback.dispose()
    }
    this.callbacks = []
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

  // Must run before any monaco.languages.* / monaco.editor.* call —
  // those internally call StandaloneServices.get(), which auto-initializes
  // with empty overrides if we haven't initialized yet, locking out our
  // override permanently (standaloneServices.js:716-718).
  StandaloneServices.initialize(serviceOverrides)

  monaco.languages.register({ id: 'solidity' })
  monaco.languages.setMonarchTokensProvider('solidity', solidity.language)
  monaco.languages.setLanguageConfiguration('solidity', solidity.configuration)

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions(jsonDiagnostics)

  monaco.editor.defineTheme('default', theme)
  monaco.editor.setTheme('default')
}
