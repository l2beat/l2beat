import { type EditorType, MonacoCodeEditor, type ToMonaco } from './monacoInit'

export type EditorPlugin<T extends EditorType> = {
  editor: ToMonaco<T>
  activate(): void
  dispose(): void
}

export type EditorPluginClass<
  T extends EditorType,
  V extends EditorPlugin<T> = EditorPlugin<T>,
> = new (editor: ToMonaco<T>) => V

export class EditorPluginStore<
  T extends EditorType,
> extends MonacoCodeEditor<T> {
  protected readonly plugins: Map<EditorPluginClass<T>, EditorPlugin<T>> =
    new Map()

  usePlugin<V extends EditorPlugin<T>>(clazz: EditorPluginClass<T, V>) {
    if (this.plugins.has(clazz)) {
      return
    }
    const instance = new clazz(this.editor)
    instance.activate()
    this.plugins.set(clazz, instance)
  }

  getPlugin<V extends EditorPlugin<T>>(clazz: EditorPluginClass<T, V>) {
    return this.plugins.get(clazz) as V | undefined
  }

  disposePlugins() {
    for (const plugin of this.plugins.values()) {
      plugin.dispose()
    }
    this.plugins.clear()
  }
}
