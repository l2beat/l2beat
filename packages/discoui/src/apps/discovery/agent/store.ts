import { create } from 'zustand'
import type { ApiAgentShowEvent } from '../../../api/types'

interface State {
  show: ApiAgentShowEvent | undefined
  index: number
  start: (show: ApiAgentShowEvent) => void
  goTo: (index: number) => void
  clear: () => void
}

export const useAgentStore = create<State>((set, get) => ({
  show: undefined,
  index: 0,
  start: (show) => set({ show, index: 0 }),
  goTo: (index) => {
    const show = get().show
    if (show === undefined) {
      return
    }
    if (Number.isInteger(index) && index >= 0 && index < show.steps.length) {
      set({ index })
    }
  },
  clear: () => set({ show: undefined, index: 0 }),
}))

// The note shows over the graph of its own project only.
export function useIsNoteShown(project: string | undefined): boolean {
  return useAgentStore(
    (state) => state.show !== undefined && state.show.project === project,
  )
}
