import { create } from 'zustand'
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

  setEditor: (key: string, editor: Editor) => void
  getEditor: (key: string) => Editor | undefined
  setFiles: (editorId: string, files: EditorFile[]) => void
  setSourceIndex: (address: string, sourceIndex: number) => void
  getSourceIndex: (address: string) => number | undefined
  showRange: (range: Range | undefined) => void
  files: Record<string, EditorFile[]>
}

export const useCodeStore = create<CodeState>((set, get) => ({
  sourceIndex: {},
  range: undefined,
  editors: {},
  files: {},
  setFiles: (editorId: string, files: EditorFile[]) =>
    set((state) => ({
      files: { ...state.files, [editorId]: files },
    })),
  setEditor: (editorId: string, editor: Editor) =>
    set((state) => ({
      editors: { ...state.editors, [editorId]: editor },
    })),
  getEditor: (editorId: string) => {
    return get().editors[editorId]
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
