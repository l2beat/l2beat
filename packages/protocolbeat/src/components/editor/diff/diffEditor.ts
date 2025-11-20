import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { cyrb64 } from '../hashes/cyrb-hash'
import { EditorPluginStore } from '../pluginStore'

export interface Change {
  readonly left: [number, number]
  readonly right: [number, number]
}

export interface Diff {
  deletions: number
  additions: number
  changes: Change[]
}

export class DiffEditor extends EditorPluginStore<'diff'> {
  private models: Record<string, editor.IDiffEditorModel | null> = {}
  private viewStates: Record<string, editor.IDiffEditorViewState | null> = {}
  private callbacks: monaco.IDisposable[] = []
  private currentCodeHash = ''

  constructor(element: HTMLElement) {
    super(element, 'diff')
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
    const disposable = this.editor.onDidUpdateDiff(() => {
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

    this.callbacks.push(disposable)
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

  private disposeCallbacks() {
    for (const callback of this.callbacks) {
      callback.dispose()
    }
    this.callbacks = []
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
    this.disposeCallbacks()
    this.disposePlugins()
    this.editor.dispose()
  }
}
