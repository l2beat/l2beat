import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

import { jsonDiagnostics } from './languages/json'
import * as solidity from './languages/solidity'
import { theme } from './theme'

let initialized = false

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
  constructor(element: HTMLElement, editorType: 'code' | 'diff') {
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
