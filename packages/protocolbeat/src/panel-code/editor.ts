import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as solidity from './solidity'
import { theme } from './theme'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
let initialized = false

export class Editor {
  private readonly editor: monaco.editor.IStandaloneCodeEditor
  private models: Record<string, editor.IModel | null> = {}
  private viewStates: Record<string, editor.ICodeEditorViewState | null> = {}
  private currentCode: string = ''

  constructor(element: HTMLElement) {
    if (!initialized) {
      init()
      initialized = true
    }

    this.editor = monaco.editor.create(element, {
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

  setCode(code: string) {
    const staleCodeHash = cyrb64(this.currentCode)
    this.models[staleCodeHash] = this.editor.getModel()
    this.viewStates[staleCodeHash] = this.editor.saveViewState()

    this.currentCode = code
    const newCodeHash = cyrb64(code)
    if (this.models[newCodeHash] === undefined) {
      this.models[newCodeHash] = monaco.editor.createModel(code, 'solidity')
    }

    this.editor.setModel(this.models[newCodeHash] ?? null)
    this.editor.restoreViewState(this.viewStates[newCodeHash] ?? null)
  }

  resize() {
    this.editor.layout()
  }

  destruct() {
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

// NOTE(radomski): Hashing function based on MurmurHash. I don't know if it
// passes smhasher so it's not cryptographically secure. If you need anything
// even semi-strong use sha2.
// Based on: https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
function cyrb64(str: string, seed: number = 0) {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  h2 = h2 >>> 0
  h1 = h1 >>> 0

  return h2.toString(36).padStart(7, '0') + h1.toString(36).padStart(7, '0')
}
