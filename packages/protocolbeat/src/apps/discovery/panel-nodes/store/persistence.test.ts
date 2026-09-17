import { describe, expect, it } from 'vitest'
import {
  clearLegacyNodeStoreVersions,
  DEFAULT_USER_PREFERENCES,
  mergeNodeStoreState,
  migrateNodeStoreState,
  partializeNodeStore,
} from './persistence'
import type { Node, State } from './State'

const USER_PREFERENCES: State['userPreferences'] = {
  enableDimming: false,
  hideLargeArrays: false,
  highlightOverlapping: false,
  useExperimentalRenderer: true,
}

describe(partializeNodeStore.name, () => {
  it('persists preferences without the graph', () => {
    const state = {
      projectId: 'ccip',
      nodes: [{ id: 'node' } as unknown as Node],
      userPreferences: USER_PREFERENCES,
    } as unknown as State

    expect(partializeNodeStore(state)).toEqual({
      userPreferences: USER_PREFERENCES,
    })
  })
})

describe(migrateNodeStoreState.name, () => {
  it('keeps preferences and drops graph data from the old payload', () => {
    const result = migrateNodeStoreState({
      projectId: 'ccip',
      nodes: [{ id: 'node', fields: new Array(10_000).fill('large') }],
      userPreferences: USER_PREFERENCES,
    })

    expect(result).toEqual({ userPreferences: USER_PREFERENCES })
  })

  it('uses defaults for an invalid payload', () => {
    expect(migrateNodeStoreState({ userPreferences: 'invalid' })).toEqual({
      userPreferences: DEFAULT_USER_PREFERENCES,
    })
  })
})

describe(mergeNodeStoreState.name, () => {
  it('does not hydrate stale nodes or a stale project', () => {
    const currentState = {
      projectId: '',
      nodes: [],
      userPreferences: DEFAULT_USER_PREFERENCES,
    } as unknown as State

    const result = mergeNodeStoreState(
      {
        projectId: 'ccip',
        nodes: [{ id: 'node' } as unknown as Node],
        userPreferences: USER_PREFERENCES,
      },
      currentState,
    )

    expect(result.projectId).toBe('')
    expect(result.nodes).toEqual([])
    expect(result.userPreferences).toEqual(USER_PREFERENCES)
  })
})

describe(clearLegacyNodeStoreVersions.name, () => {
  it('removes obsolete graph snapshots', () => {
    const removed: string[] = []

    clearLegacyNodeStoreVersions({
      removeItem: (key) => removed.push(key),
    })

    expect(removed).toEqual(['store-v2', 'store-v3', 'store-v4', 'store-v5'])
  })
})
