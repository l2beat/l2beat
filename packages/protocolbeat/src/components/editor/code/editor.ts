import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { EditorPluginStore } from '../pluginStore'
import type { EditorFile } from '../store'

export type EditorSupportedLanguage = 'solidity' | 'json'

export type EditorCallbacks = {
  onSave?: (content: string) => string
  onChange?: (content: string) => void
  onLoad?: (content: string) => void
}

export class Editor extends EditorPluginStore<'code'> {
  private models: Record<string, editor.IModel | null> = {}
  private viewStates: Record<string, editor.ICodeEditorViewState | null> = {}

  private onSaveCallback: ((content: string) => string) | null = null
  private onChangeCallback: ((content: string) => void) | null = null
  private onLoadCallback: ((content: string) => void) | null = null

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

    this.editor.onDidChangeModelContent(() => {
      if (this.onChangeCallback) {
        const value = this.editor.getModel()?.getValue() ?? ''
        this.onChangeCallback(value)
      }
    })

    this.editor.onDidChangeModel((e) => {
      if (e.oldModelUrl == null && this.onLoadCallback) {
        const value = this.editor.getModel()?.getValue() ?? ''
        this.onLoadCallback(value)
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

  onChange(onChangeCallback: (content: string) => void) {
    this.onChangeCallback = onChangeCallback
  }

  onLoad(onLoadCallback: (content: string) => void) {
    this.onLoadCallback = onLoadCallback
  }

  detachListeners() {
    this.onSaveCallback = null
    this.onChangeCallback = null
    this.onLoadCallback = null
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

    for (const plugin of this.plugins.values()) {
      plugin.dispose()
    }

    this.detachListeners()
    this.plugins.clear()
    this.editor.dispose()
  }
}
