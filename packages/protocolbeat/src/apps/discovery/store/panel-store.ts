import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserSettings {
  /**
   * If true, unreachable entries should have a distinctive visual treatment.
   */
  readonly markUnreachableEntries: boolean
}

interface State {
  readonly selected: string | undefined
  readonly highlighted: readonly string[]

  readonly userSettings: UserSettings
}

interface Actions {
  select: (selected: string | undefined) => void
  highlight: (highlighted: readonly string[]) => void
}

const INITIAL_STATE: State = {
  selected: undefined,
  highlighted: [],
  userSettings: {
    markUnreachableEntries: true,
  },
}

/**
 * This store should be considered `global` for the discovery app.
 * Anything that is not specific to a single panel or is meant to be shared across panels should be stored here.
 */
// TODO: rename me separately - something like useMultiViewStore or useDiscoveryAppStore
export const usePanelStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      select: (selected) => set(() => ({ selected })),
      highlight: (highlighted) => set(() => ({ highlighted })),
    }),
    {
      name: 'discovery-app-store-v2',
      partialize: (state) => ({
        userSettings: state.userSettings,
      }),
    },
  ),
)
