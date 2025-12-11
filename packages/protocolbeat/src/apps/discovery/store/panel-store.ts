import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  readonly selected: string | undefined
  readonly highlighted: readonly string[]
}

interface Actions {
  select: (selected: string | undefined) => void
  highlight: (highlighted: readonly string[]) => void
}

const INITIAL_STATE: State = {
  selected: undefined,
  highlighted: [],
}

export const usePanelStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      select: (selected) => set(() => ({ selected })),
      highlight: (highlighted) => set(() => ({ highlighted })),
    }),
    {
      name: 'discovery-app-selection-store-v1',
      partialize: (state) => ({
        selected: state.selected,
      }),
    },
  ),
)
