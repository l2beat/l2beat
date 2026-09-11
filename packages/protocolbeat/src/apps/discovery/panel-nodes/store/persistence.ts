import { v } from '@l2beat/validate'
import type { State } from './State'

const UserPreferencesSchema = v.object({
  enableDimming: v.boolean(),
  hideLargeArrays: v.boolean(),
  highlightOverlapping: v.boolean(),
  useExperimentalRenderer: v.boolean(),
})

const PersistedNodeStoreStateSchema = v.object({
  userPreferences: UserPreferencesSchema,
})

export type PersistedNodeStoreState = v.infer<
  typeof PersistedNodeStoreStateSchema
>

export const DEFAULT_USER_PREFERENCES: State['userPreferences'] = {
  enableDimming: true,
  hideLargeArrays: true,
  highlightOverlapping: true,
  useExperimentalRenderer: false,
}

export const NODE_STORE_VERSION = 1

const LEGACY_NODE_STORE_KEYS = ['store-v2', 'store-v3', 'store-v4', 'store-v5']

export function clearLegacyNodeStoreVersions(
  storage: Pick<Storage, 'removeItem'>,
): void {
  for (const key of LEGACY_NODE_STORE_KEYS) {
    try {
      storage.removeItem(key)
    } catch {
      // Storage can be unavailable even when the global exists.
      return
    }
  }
}

export function partializeNodeStore(state: State): PersistedNodeStoreState {
  return {
    userPreferences: state.userPreferences,
  }
}

export function migrateNodeStoreState(
  persistedState: unknown,
): PersistedNodeStoreState {
  const result = PersistedNodeStoreStateSchema.safeParse(persistedState)
  if (result.success) {
    return result.data
  }
  return {
    userPreferences: DEFAULT_USER_PREFERENCES,
  }
}

export function mergeNodeStoreState<T extends State>(
  persistedState: unknown,
  currentState: T,
): T {
  return {
    ...currentState,
    userPreferences: migrateNodeStoreState(persistedState).userPreferences,
  }
}
