import { create } from 'zustand'
import type { Editor, EditorSupportedLanguage } from './code/editor'
import type { DiffEditor } from './diff/diffEditor'

export interface Range {
  startOffset: number
  length: number
}

export type EditorFile = {
  id: string
  name: string
  content: string
  readOnly: boolean
  language?: EditorSupportedLanguage
}

interface CodeState {
  sourceIndex: Record<string, number>
  ranges: Record<string, Range>
  editors: Record<string, Editor>
  diffEditors: Record<string, DiffEditor>
  // editorId -> fileId -> dirty
  dirtyFiles: Record<string, Record<string, boolean>>

  setEditor: (key: string, editor: Editor) => void
  getEditor: (key: string) => Editor | undefined
  removeEditor: (key: string) => void
  setDiffEditor: (key: string, editor: DiffEditor) => void
  getDiffEditor: (key: string) => DiffEditor | undefined
  removeDiffEditor: (key: string) => void
  setSourceIndex: (address: string, sourceIndex: number) => void
  getSourceIndex: (address: string) => number | undefined
  showRange: (address: string, range: Range | undefined) => void
  resetRange: () => void
  getRange: (address: string) => Range | undefined

  setDirtyFile: (editorId: string, fileId: string, dirty: boolean) => void
  getIsDirtyFile: (editorId: string, fileId: string) => boolean
  resetDirtyFiles: () => void
}

interface DiffSettings {
  fold: boolean
  removeUnchanged: boolean
  removeComments: boolean
  swapped: boolean
}

interface DiffSettingsStore extends DiffSettings {
  toggleFold: () => void
  toggleRemoveUnchanged: () => void
  toggleRemoveComments: () => void
  toggleSwapped: () => void
  setSettings: (settings: Partial<DiffSettings>) => void
}

export const useCodeStore = create<CodeState>((set, get) => ({
  sourceIndex: {},
  ranges: {},
  editors: {},
  diffEditors: {},
  dirtyFiles: {},
  setEditor: (editorId: string, editor: Editor) =>
    set((state) => ({
      editors: { ...state.editors, [editorId]: editor },
    })),
  getEditor: (editorId: string) => {
    return get().editors[editorId]
  },
  removeEditor: (editorId: string) =>
    set((state) => {
      const { [editorId]: _, ...editors } = state.editors
      return { editors }
    }),
  setDiffEditor: (editorId: string, editor: DiffEditor) =>
    set((state) => ({
      diffEditors: { ...state.diffEditors, [editorId]: editor },
    })),
  getDiffEditor: (editorId: string) => {
    return get().diffEditors[editorId]
  },
  removeDiffEditor: (editorId: string) =>
    set((state) => {
      const { [editorId]: _, ...diffEditors } = state.diffEditors
      return { diffEditors }
    }),
  setSourceIndex: (address: string, sourceIndex: number) =>
    set((state) => ({
      sourceIndex: { ...state.sourceIndex, [address]: sourceIndex },
    })),
  getSourceIndex: (address: string) => {
    return get().sourceIndex[address]
  },
  showRange: (address: string, range: Range | undefined) =>
    set((state) => {
      if (range === undefined) {
        const { [address]: _, ...restRanges } = state.ranges
        return { ranges: restRanges }
      }
      return { ranges: { ...state.ranges, [address]: range } }
    }),
  resetRange: () => set({ ranges: {} }),
  getRange: (address: string) => {
    return get().ranges[address]
  },
  setDirtyFile: (editorId: string, fileId: string, dirty: boolean) =>
    set((state) => ({
      dirtyFiles: {
        ...state.dirtyFiles,
        [editorId]: { ...state.dirtyFiles[editorId], [fileId]: dirty },
      },
    })),
  getIsDirtyFile: (editorId: string, fileId: string) => {
    return get().dirtyFiles[editorId]?.[fileId] ?? false
  },
  resetDirtyFiles: () => set({ dirtyFiles: {} }),
}))

export const useDiffSettingsStore = create<DiffSettingsStore>((set) => ({
  fold: false,
  removeUnchanged: false,
  removeComments: false,
  swapped: false,

  toggleFold: () => set((state) => ({ fold: !state.fold })),
  toggleRemoveUnchanged: () =>
    set((state) => ({ removeUnchanged: !state.removeUnchanged })),
  toggleRemoveComments: () =>
    set((state) => ({ removeComments: !state.removeComments })),
  toggleSwapped: () => set((state) => ({ swapped: !state.swapped })),

  setSettings: (settings) => set((state) => ({ ...state, ...settings })),
}))
