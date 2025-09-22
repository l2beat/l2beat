import { create } from 'zustand'

interface State {
  readonly selected: string | undefined
  readonly highlighted: readonly string[]
}

interface Actions {
  select: (selected: string | undefined) => void
  highlight: (highlighted: readonly string[]) => void
}

export const usePanelStore = create<State & Actions>((set) => ({
  selected: undefined,
  highlighted: [],
  select: (selected) => set(() => ({ selected })),
  highlight: (highlighted) => set(() => ({ highlighted })),
}))
