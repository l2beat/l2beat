import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as solidity from './solidity'
import { theme } from './theme'

let initialized = false

export function create(element: HTMLElement) {
  if (!initialized) {
    init()
    initialized = true
  }
  return monaco.editor.create(element, {
    language: 'solidity',
    minimap: { enabled: false },
    readOnly: true,
    colorDecorators: false,
    renderWhitespace: 'none',
    renderControlCharacters: false,
    fontFamily:
      "ui-monospace, Menlo, Monaco, 'Cascadia Code', 'Source Code Pro', Consolas, 'DejaVu Sans Mono', monospace",
    // @ts-expect-error Thanks you Microsoft
    'bracketPairColorization.enabled': false,
  })
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
