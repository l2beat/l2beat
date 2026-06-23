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

const FIND_WITH_ARGS_ACTION_ID = 'editor.actions.findWithArgs'

// Session-scoped view state cache: persists folds/cursor/scroll per file URI
// across Editor instance lifecycles - stable and mainly to help with React's StrictMode double-renders
const viewStateCache: Map<string, editor.ICodeEditorViewState> = new Map()

export class Editor extends EditorPluginStore<'code'> {
  private models: Record<string, editor.IModel | null> = {}
  private disposed = false

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
    // A remount can queue setFile against the previous editor instance, which
    // is disposed during the same React commit. Driving a disposed Monaco
    // editor throws "InstantiationService has been disposed". The live editor
    // re-registers in the store and receives the file on the next render.
    if (this.disposed) {
      return
    }
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

  onChange(onChangeCallback: (content: string) => void): monaco.IDisposable {
    const disposable = this.editor.onDidChangeModelContent(() => {
      const value = this.editor.getModel()?.getValue() ?? ''
      onChangeCallback(value)
    })

    return this.trackDisposable(disposable)
  }

  onLoad(onLoadCallback: (content: string) => void): monaco.IDisposable {
    const disposable = this.editor.onDidChangeModel((e) => {
      if (e.oldModelUrl == null) {
        const value = this.editor.getModel()?.getValue() ?? ''
        onLoadCallback(value)
      }
    })

    return this.trackDisposable(disposable)
  }

  find(searchString: string) {
    const model = this.editor.getModel()
    if (model === null) {
      return
    }

    this.editor.focus()
    this.editor.getAction(FIND_WITH_ARGS_ACTION_ID)?.run({ searchString })
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
    if (this.disposed) {
      return
    }
    this.disposed = true
    this.onSaveCallback = null
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
