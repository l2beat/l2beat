import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  readonly selected: string[]
  readonly highlighted: readonly string[]
  readonly revealedField: string | undefined
}

interface Actions {
  select: (selected: string[]) => void
  highlight: (highlighted: readonly string[]) => void
  revealField: (revealedField: string | undefined) => void
}

const INITIAL_STATE: State = {
  selected: [],
  highlighted: [],
  revealedField: undefined,
}

export const usePanelStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      select: (selected) => set(() => ({ selected })),
      highlight: (highlighted) => set(() => ({ highlighted })),
      revealField: (revealedField) => set(() => ({ revealedField })),
    }),
    {
      name: 'discovery-app-selection-store-v1',
      partialize: (state) => ({
        selected: state.selected,
      }),
    },
  ),
)
