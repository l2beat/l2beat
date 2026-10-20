import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  bracketMatching,
  codeFolding,
  foldEffect,
  foldedRanges,
  foldGutter,
  foldKeymap,
} from '@codemirror/language'
import {
  findNext,
  highlightSelectionMatches,
  openSearchPanel,
  SearchQuery,
  searchKeymap,
  setSearchQuery,
} from '@codemirror/search'
import {
  Compartment,
  EditorSelection,
  EditorState,
  type Extension,
  type StateEffect,
} from '@codemirror/state'
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  scrollPastEnd,
} from '@codemirror/view'
import { assert } from '@l2beat/shared-pure'
import { indentGuides } from '../indentGuides'
import type { JsonSchemaConfig, JsonSupport } from '../languages/json'
import { solidity } from '../languages/solidity'
import {
  type EditorPlugin,
  type EditorPluginClass,
  EditorPluginStore,
} from '../plugin'
import { centeredSearch } from '../search'
import type { EditorFile } from '../store'
import { theme } from '../theme'

export type EditorSupportedLanguage = 'solidity' | 'json'

export type EditorContentCallback = (content: string) => void
export type EditorSaveCallback = (content: string) => boolean
export type EditorCallbacks = {
  onSave?: EditorSaveCallback
  onChange?: EditorContentCallback
  onLoad?: EditorContentCallback
}

interface Disposable {
  dispose(): void
}

interface FileViewState {
  docLength: number
  selection: ReturnType<EditorSelection['toJSON']>
  folds: { from: number; to: number }[]
  scroll: StateEffect<unknown>
}

// Session-scoped view state cache: persists folds/cursor/scroll per file
// across Editor instance lifecycles - stable and mainly to help with React's StrictMode double-renders
const viewStateCache = new Map<string, FileViewState>()

export class Editor {
  readonly view: EditorView
  private readonly base: Extension = this.baseExtensions()
  private readonly plugins: EditorPluginStore<EditorView>
  private readonly readOnly = new Compartment()
  // Each file keeps its own state, with its undo history and folds, while
  // this editor lives.
  private readonly fileStates = new Map<string, EditorState>()
  private activeFileKey: string | undefined
  private readonly changeListeners = new Set<EditorContentCallback>()
  private readonly loadListeners = new Set<EditorContentCallback>()
  private saveCallback: ((content: string) => string) | null = null
  private disposed = false

  // JSON support comes from the JSON views, so code views load without it.
  constructor(
    element: HTMLElement,
    private readonly json?: JsonSupport,
  ) {
    this.view = new EditorView({
      parent: element,
      state: EditorState.create({ extensions: this.base }),
    })
    this.plugins = new EditorPluginStore(this.view)
  }

  usePlugin<V extends EditorPlugin>(clazz: EditorPluginClass<EditorView, V>) {
    // Plugins join the states created per file, so they come before files.
    assert(this.activeFileKey === undefined, 'Plugin added after a file')
    this.plugins.add(clazz)
  }

  getPlugin<V extends EditorPlugin>(clazz: EditorPluginClass<EditorView, V>) {
    return this.plugins.get(clazz)
  }

  // Without an authority, which the JSON language service lowercases before
  // matching a schema's `fileMatch` against it.
  createUri(file: EditorFile): string {
    return `inmemory:/${file.id}/${file.name}`
  }

  upsertJsonSchema(config: JsonSchemaConfig) {
    assert(this.json !== undefined, 'Editor without JSON support')
    this.json.upsertSchema(config)
  }

  removeJsonSchema(uri: string) {
    assert(this.json !== undefined, 'Editor without JSON support')
    this.json.removeSchema(uri)
  }

  setFile(file: EditorFile) {
    // A remount can queue setFile against the previous editor instance, which
    // is disposed during the same React commit. The live editor re-registers
    // in the store and receives the file on the next render.
    if (this.disposed) {
      return
    }
    const key = fileKey(file)
    const isFirstFile = this.activeFileKey === undefined
    if (key !== this.activeFileKey) {
      this.switchToFile(key, file)
    }
    if (this.view.state.readOnly !== file.readOnly) {
      this.view.dispatch({
        effects: this.readOnly.reconfigure(
          EditorState.readOnly.of(file.readOnly),
        ),
      })
    }
    replaceContent(this.view, file.content)
    if (isFirstFile) {
      const content = this.view.state.doc.toString()
      for (const listener of this.loadListeners) {
        listener(content)
      }
    }
  }

  onSave(onSaveCallback: (content: string) => string) {
    this.saveCallback = onSaveCallback
  }

  onChange(onChangeCallback: EditorContentCallback): Disposable {
    this.changeListeners.add(onChangeCallback)
    return { dispose: () => this.changeListeners.delete(onChangeCallback) }
  }

  onLoad(onLoadCallback: EditorContentCallback): Disposable {
    this.loadListeners.add(onLoadCallback)
    return { dispose: () => this.loadListeners.delete(onLoadCallback) }
  }

  find(searchString: string) {
    this.view.focus()
    // Opening the panel seeds the query from the selection, so it goes first.
    openSearchPanel(this.view)
    this.view.dispatch({
      effects: setSearchQuery.of(new SearchQuery({ search: searchString })),
    })
    findNext(this.view)
  }

  dispose() {
    if (this.disposed) {
      return
    }
    this.disposed = true
    this.rememberActiveFile()
    this.saveCallback = null
    this.changeListeners.clear()
    this.loadListeners.clear()
    this.fileStates.clear()
    this.plugins.dispose()
    this.view.destroy()
  }

  private switchToFile(key: string, file: EditorFile) {
    this.rememberActiveFile()
    const existing = this.fileStates.get(key)
    this.view.setState(existing ?? this.createState(file))
    this.activeFileKey = key
    const cached = viewStateCache.get(key)
    if (cached === undefined) {
      this.view.dispatch({
        effects: EditorView.scrollIntoView(0, { y: 'start' }),
      })
      return
    }
    if (existing === undefined) {
      restoreViewState(this.view, cached)
    } else {
      this.view.dispatch({ effects: cached.scroll })
    }
  }

  private rememberActiveFile() {
    if (this.activeFileKey === undefined) {
      return
    }
    this.fileStates.set(this.activeFileKey, this.view.state)
    viewStateCache.set(this.activeFileKey, captureViewState(this.view))
  }

  private createState(file: EditorFile): EditorState {
    return EditorState.create({
      doc: file.content,
      extensions: [
        this.base,
        this.readOnly.of(EditorState.readOnly.of(file.readOnly)),
        this.languageExtension(file),
        this.plugins.extensions(),
      ],
    })
  }

  private languageExtension(file: EditorFile): Extension {
    if (file.language === 'json') {
      assert(this.json !== undefined, 'JSON file in an editor without JSON')
      return this.json.extension(this.createUri(file))
    }
    return file.language === 'solidity' ? solidity : []
  }

  private baseExtensions(): Extension {
    return [
      lineNumbers(),
      foldGutter(),
      codeFolding(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      indentGuides,
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      bracketMatching(),
      highlightSelectionMatches({ highlightWordAroundCursor: true }),
      historyCompartment.of(history()),
      centeredSearch,
      scrollPastEnd(),
      theme,
      keymap.of([
        { key: 'Mod-s', run: () => this.save(), preventDefault: true },
        ...searchKeymap,
        ...foldKeymap,
        ...historyKeymap,
        ...defaultKeymap,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString()
          for (const listener of this.changeListeners) {
            listener(content)
          }
        }
      }),
    ]
  }

  private save(): boolean {
    // Read-only files never save, even when a save callback from an editable
    // file of the same editor is still set.
    if (this.saveCallback === null || this.view.state.readOnly) {
      return true
    }
    const content = this.view.state.doc.toString()
    replaceContent(this.view, this.saveCallback(content))
    return true
  }
}

function fileKey(file: EditorFile): string {
  return `${file.id}.${file.language}`
}

function captureViewState(view: EditorView): FileViewState {
  const folds: { from: number; to: number }[] = []
  foldedRanges(view.state).between(0, view.state.doc.length, (from, to) => {
    folds.push({ from, to })
  })
  return {
    docLength: view.state.doc.length,
    selection: view.state.selection.toJSON(),
    folds,
    scroll: view.scrollSnapshot(),
  }
}

// The cached positions only make sense for the text they were taken on.
function restoreViewState(view: EditorView, cached: FileViewState) {
  if (cached.docLength !== view.state.doc.length) {
    return
  }
  view.dispatch({
    selection: EditorSelection.fromJSON(cached.selection),
    effects: [
      ...cached.folds.map((fold) => foldEffect.of(fold)),
      cached.scroll,
    ],
  })
}

// Replaces only the span that differs, so the cursor, folds and scroll
// position outside of it survive.
// Text set from outside, like a file loaded or saved, starts a new history,
// as Monaco's setValue did, so undo never steps into text it did not record.
const historyCompartment = new Compartment()

function replaceContent(view: EditorView, content: string) {
  const current = view.state.doc.toString()
  if (current === content) {
    return
  }
  const sharedLength = Math.min(current.length, content.length)
  let prefixLength = 0
  while (
    prefixLength < sharedLength &&
    current.charCodeAt(prefixLength) === content.charCodeAt(prefixLength)
  ) {
    prefixLength++
  }
  let suffixLength = 0
  while (
    suffixLength < sharedLength - prefixLength &&
    current.charCodeAt(current.length - 1 - suffixLength) ===
      content.charCodeAt(content.length - 1 - suffixLength)
  ) {
    suffixLength++
  }
  view.dispatch({
    changes: {
      from: prefixLength,
      to: current.length - suffixLength,
      insert: content.slice(prefixLength, content.length - suffixLength),
    },
    effects: historyCompartment.reconfigure([]),
  })
  view.dispatch({ effects: historyCompartment.reconfigure(history()) })
}
