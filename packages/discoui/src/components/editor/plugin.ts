import type { Extension } from '@codemirror/state'

// A plugin contributes `extension` to every state its editor creates, and
// keeps a handle to the host (an EditorView) to drive it from React.
export interface EditorPlugin {
  readonly extension: Extension
  dispose(): void
}

export type EditorPluginClass<
  Host,
  V extends EditorPlugin = EditorPlugin,
> = new (host: Host) => V

export class EditorPluginStore<Host> {
  private readonly plugins = new Map<EditorPluginClass<Host>, EditorPlugin>()

  constructor(private readonly host: Host) {}

  add<V extends EditorPlugin>(clazz: EditorPluginClass<Host, V>) {
    if (!this.plugins.has(clazz)) {
      this.plugins.set(clazz, new clazz(this.host))
    }
  }

  get<V extends EditorPlugin>(clazz: EditorPluginClass<Host, V>) {
    return this.plugins.get(clazz) as V | undefined
  }

  extensions(): Extension[] {
    return [...this.plugins.values()].map((plugin) => plugin.extension)
  }

  dispose() {
    for (const plugin of this.plugins.values()) {
      plugin.dispose()
    }
    this.plugins.clear()
  }
}
