import { create } from 'zustand'
import type { MonacoJsonEditor } from './MonacoJsonEditor'

interface MonacoJsonEditorState {
  editors: Record<string, MonacoJsonEditor>
  setEditor: (key: string, editor: MonacoJsonEditor) => void
  removeEditor: (key: string, editor: MonacoJsonEditor) => void
}

export const useMonacoJsonEditorStore = create<MonacoJsonEditorState>(
  (set) => ({
    editors: {},
    setEditor: (key, editor) =>
      set((state) => ({ editors: { ...state.editors, [key]: editor } })),
    removeEditor: (key, editor) =>
      set((state) => {
        if (state.editors[key] !== editor) {
          return state
        }
        const { [key]: _, ...editors } = state.editors
        return { editors }
      }),
  }),
)
