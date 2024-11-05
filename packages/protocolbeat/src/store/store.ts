import { create } from 'zustand'

export interface State {
  readonly selected: string | undefined
}

export interface Actions {
  select: (selected: string | undefined) => void
}

export const usePanelStore = create<State & Actions>((set) => ({
  selected: undefined,
  select: (selected) => set(() => ({ selected })),
}))
