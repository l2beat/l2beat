import { create } from 'zustand'
import type { DiffEditor } from './diffEditor'
import type { Editor, EditorSupportedLanguage } from './editor'

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
  range: Range | undefined
  editors: Record<string, Editor>
  diffEditors: Record<string, DiffEditor>

  setEditor: (key: string, editor: Editor) => void
  getEditor: (key: string) => Editor | undefined
  removeEditor: (key: string) => void
  setDiffEditor: (key: string, editor: DiffEditor) => void
  getDiffEditor: (key: string) => DiffEditor | undefined
  setSourceIndex: (address: string, sourceIndex: number) => void
  getSourceIndex: (address: string) => number | undefined
  showRange: (range: Range | undefined) => void
}

export const useCodeStore = create<CodeState>((set, get) => ({
  sourceIndex: {},
  range: undefined,
  editors: {},
  diffEditors: {},

  setEditor: (editorId: string, editor: Editor) =>
    set((state) => ({
      editors: { ...state.editors, [editorId]: editor },
    })),
  getEditor: (editorId: string) => {
    return get().editors[editorId]
  },
  removeEditor: (editorId: string) =>
    set((state) => {
      const { [editorId]: removed, ...editors } = state.editors
      return { editors }
    }),
  setDiffEditor: (editorId: string, editor: DiffEditor) =>
    set((state) => ({
      diffEditors: { ...state.diffEditors, [editorId]: editor },
    })),
  getDiffEditor: (editorId: string) => {
    return get().diffEditors[editorId]
  },
  setSourceIndex: (address: string, sourceIndex: number) =>
    set((state) => ({
      sourceIndex: { ...state.sourceIndex, [address]: sourceIndex },
    })),
  getSourceIndex: (address: string) => {
    return get().sourceIndex[address]
  },
  showRange: (range: Range | undefined) => set({ range }),
}))
