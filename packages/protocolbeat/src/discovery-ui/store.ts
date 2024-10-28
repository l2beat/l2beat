import { create } from 'zustand'

export interface State {
  selected: string[]
}

export interface Actions {
  select: (selected: string[]) => void
}

export const usePanelStore = create<State & Actions>((set) => ({
  selected: [],
  select: (selected) => set(() => ({ selected })),
}))
