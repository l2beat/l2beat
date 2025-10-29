import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  /**
   * If true, unreachable entries should have a distinctive visual treatment.
   */
  readonly markUnreachableEntries: boolean
}

interface Actions {
  setUserSettings: (userSettings: Partial<State>) => void
}

const INITIAL_STATE: State = {
  markUnreachableEntries: true,
}

export const useGlobalSettingsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      setUserSettings: (userSettings) =>
        set(() => ({
          ...get(),
          ...userSettings,
        })),
    }),
    {
      name: 'discovery-app-settings-v1',
    },
  ),
)
