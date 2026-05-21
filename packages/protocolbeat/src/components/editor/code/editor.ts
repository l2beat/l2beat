import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { EditorPluginStore } from '../pluginStore'
import type { EditorFile } from '../store'

export type EditorSupportedLanguage = 'solidity' | 'json'

export type EditorContentCallback = (content: string) => void
export type EditorSaveCallback = (content: string) => boolean
export type EditorCallbacks = {
  onSave?: EditorSaveCallback
  onChange?: EditorContentCallback
  onLoad?: EditorContentCallback
}

// Session-scoped view state cache: persists folds/cursor/scroll per file URI
// across Editor instance lifecycles - stable and mainly to help with React's StrictMode double-renders
const viewStateCache: Map<string, editor.ICodeEditorViewState> = new Map()

export class Editor extends EditorPluginStore<'code'> {
  private models: Record<string, editor.IModel | null> = {}
  private callbacks: monaco.IDisposable[] = []

  private onSaveCallback: ((content: string) => string) | null = null

  constructor(element: HTMLElement) {
    super(element, 'code')

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
  }

  public createUri(file: EditorFile) {
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
    // Special case for command
    this.onSaveCallback = onSaveCallback
  }

  onChange(onChangeCallback: (content: string) => void) {
    const disposable = this.editor.onDidChangeModelContent(() => {
      const value = this.editor.getModel()?.getValue() ?? ''
      onChangeCallback(value)
    })

    this.callbacks.push(disposable)
  }

  onLoad(onLoadCallback: (content: string) => void) {
    const disposable = this.editor.onDidChangeModel((e) => {
      if (e.oldModelUrl == null) {
        const value = this.editor.getModel()?.getValue() ?? ''
        onLoadCallback(value)
      }
    })

    this.callbacks.push(disposable)
  }

  private disposeCallbacks() {
    this.onSaveCallback = null
    for (const callback of this.callbacks) {
      callback.dispose()
    }
    this.callbacks = []
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

    const state = this.editor.saveViewState()
    if (state !== null) {
      viewStateCache.set(model.uri.toString(), state)
    }
  }

  private restoreViewState() {
    const model = this.editor.getModel()
    if (model === null) {
      return
    }

    this.editor.restoreViewState(
      viewStateCache.get(model.uri.toString()) ?? null,
    )
  }

  resize() {
    this.editor.layout()
  }

  dispose() {
    this.saveViewState()
    Object.values(this.models).forEach((model) => {
      if (model) {
        model.dispose()
      }
    })
    this.models = {}
    this.disposeCallbacks()
    this.disposePlugins()
    this.editor.dispose()
  }
}
