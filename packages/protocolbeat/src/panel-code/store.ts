import { create } from 'zustand'
import type { Editor } from './editor'

export interface Range {
  startOffset: number
  length: number
}

interface CodeState {
  sourceIndex: Record<string, number>
  range: Range | undefined
  editor: Editor | undefined

  setEditor: (editor: Editor) => void
  setSourceIndex: (address: string, sourceIndex: number) => void
  getSourceIndex: (address: string) => number | undefined
  showRange: (range: Range | undefined) => void
}

export const useCodeStore = create<CodeState>((set, get) => ({
  sourceIndex: {},
  range: undefined,
  editor: undefined,

  setEditor: (editor: Editor) => set({ editor }),
  setSourceIndex: (address: string, sourceIndex: number) =>
    set((state) => ({
      sourceIndex: { ...state.sourceIndex, [address]: sourceIndex },
    })),
  getSourceIndex: (address: string) => {
    return get().sourceIndex[address]
  },
  showRange: (range: Range | undefined) => set({ range }),
}))
