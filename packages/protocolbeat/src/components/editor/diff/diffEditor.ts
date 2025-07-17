import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { cyrb64 } from '../cyrb-hash'
import * as solidity from '../languages/solidity'
import { theme } from '../theme'
import { LineSelector } from './extensions/lineSelector'

let monacoInitialized = false
const knownElements: Map<HTMLElement, DiffEditor> = new Map()

export interface Change {
  readonly left: [number, number]
  readonly right: [number, number]
}

export interface Diff {
  deletions: number
  additions: number
  changes: Change[]
}

export class DiffEditor {
  private readonly editor: monaco.editor.IStandaloneDiffEditor
  private models: Record<string, editor.IDiffEditorModel | null> = {}
  private viewStates: Record<string, editor.IDiffEditorViewState | null> = {}
  private currentCodeHash = ''
  private readonly element: HTMLElement

  public lineSelector: LineSelector

  constructor(element: HTMLElement) {
    this.element = element

    if (monacoInitialized === false) {
      monacoInitialized = true
      init()
    }

    const existingEditor = knownElements.get(element)
    if (existingEditor) {
      existingEditor.dispose()
    }

    this.editor = monaco.editor.createDiffEditor(element, {
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

    this.lineSelector = new LineSelector(this.editor)
    this.lineSelector.init()

    knownElements.set(element, this)
  }

  setDiff(codeLeft: string, codeRight: string) {
    const currentModel = this.editor.getModel()

    if (currentModel) {
      this.models[this.currentCodeHash] = currentModel
      this.viewStates[this.currentCodeHash] = this.editor.saveViewState()
    }

    const newCodeHash = cyrb64(cyrb64(codeLeft) + cyrb64(codeRight))
    this.currentCodeHash = newCodeHash

    if (this.models[newCodeHash] === undefined) {
      this.models[newCodeHash] = {
        original: monaco.editor.createModel(codeLeft, 'solidity'),
        modified: monaco.editor.createModel(codeRight, 'solidity'),
      }
    }

    this.editor.setModel(this.models[newCodeHash] ?? null)
    this.editor.restoreViewState(this.viewStates[newCodeHash] ?? null)
  }

  onComputedDiff(listener: (diff: Diff) => void) {
    this.editor.onDidUpdateDiff(() => {
      const lineChanges = this.editor.getLineChanges() ?? []
      let deletions = 0
      let additions = 0

      const changes: Change[] = []
      for (const c of lineChanges) {
        changes.push({
          left: [c.originalStartLineNumber, c.originalEndLineNumber],
          right: [c.modifiedStartLineNumber, c.modifiedEndLineNumber],
        })

        if (c.originalEndLineNumber > 0) {
          deletions += c.originalEndLineNumber - c.originalStartLineNumber + 1
        }
        if (c.modifiedEndLineNumber > 0) {
          additions += c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1
        }
      }

      listener({ deletions, additions, changes })
    })
  }

  resize() {
    this.editor.layout()
  }

  setFolding(folding: boolean) {
    this.editor.updateOptions({
      hideUnchangedRegions: {
        enabled: folding,
      },
    })
  }

  toNextDiff() {
    this.editor.goToDiff('next')
  }

  toPreviousDiff() {
    this.editor.goToDiff('previous')
  }

  dispose() {
    Object.values(this.models).forEach((model) => {
      if (model) {
        model.original.dispose()
        model.modified.dispose()
      }
    })
    this.models = {}
    this.viewStates = {}

    knownElements.delete(this.element)

    this.lineSelector?.dispose()
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
