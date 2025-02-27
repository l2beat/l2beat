import { create } from 'zustand'

export interface SelectedAddress {
  address: string
  project: string
}

interface State {
  readonly selected: SelectedAddress | undefined
}

interface Actions {
  select: (selected: SelectedAddress | undefined) => void
}

export const usePanelStore = create<State & Actions>((set) => ({
  selected: undefined,
  select: (selected) => set(() => ({ selected })),
}))
