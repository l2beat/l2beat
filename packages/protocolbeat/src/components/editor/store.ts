import { create } from 'zustand'
import type { DiffEditor } from './diffEditor'
import type { Editor } from './editor'

export interface Range {
  startOffset: number
  length: number
}

interface CodeState {
  sourceIndex: Record<string, number>
  range: Range | undefined
  editors: Record<string, Editor>
  diffEditors: Record<string, DiffEditor>

  setEditor: (key: string, editor: Editor) => void
  getEditor: (key: string) => Editor | undefined
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

  setEditor: (key: string, editor: Editor) =>
    set((state) => ({
      editors: { ...state.editors, [key]: editor },
    })),
  getEditor: (key: string) => {
    return get().editors[key]
  },
  setDiffEditor: (key: string, editor: DiffEditor) =>
    set((state) => ({
      diffEditors: { ...state.diffEditors, [key]: editor },
    })),
  getDiffEditor: (key: string) => {
    return get().diffEditors[key]
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
