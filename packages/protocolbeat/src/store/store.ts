import { create } from 'zustand'

export interface State {
  readonly selected: readonly string[]
}

export interface Actions {
  select: (selected: readonly string[]) => void
}

export const usePanelStore = create<State & Actions>((set) => ({
  selected: [],
  select: (selected) => set(() => ({ selected })),
}))
