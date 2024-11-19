import { create } from 'zustand'

interface State {
  readonly selected: string | undefined
}

interface Actions {
  select: (selected: string | undefined) => void
}

export const usePanelStore = create<State & Actions>((set) => ({
  selected: undefined,
  select: (selected) => set(() => ({ selected })),
}))
