import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  /**
   * If true, unreachable entries should have a distinctive visual treatment.
   */
  readonly markUnreachableEntries: boolean
  /**
   * Maximum BFS depth used when computing reachable entries on the server.
   * `null` means unlimited (server default).
   */
  readonly maxReachableDepth: number | null
}

interface Actions {
  setUserSettings: (userSettings: Partial<State>) => void
}

const INITIAL_STATE: State = {
  markUnreachableEntries: true,
  maxReachableDepth: null,
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
