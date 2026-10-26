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
  /**
   * If true, go to definition shows the definition inline under the line
   * instead of jumping to it.
   */
  readonly peekDefinitions: boolean
}

interface Actions {
  setUserSettings: (userSettings: Partial<State>) => void
}

const INITIAL_STATE: State = {
  markUnreachableEntries: true,
  maxReachableDepth: null,
  peekDefinitions: false,
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
