import { expect, mockObject } from 'earl'
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
    const state = mockObject<State>({
      projectId: 'ccip',
      nodes: [mockObject<Node>({ id: 'node' })],
      userPreferences: USER_PREFERENCES,
    })

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
    const currentState = mockObject<State>({
      projectId: '',
      nodes: [],
      userPreferences: DEFAULT_USER_PREFERENCES,
    })

    const result = mergeNodeStoreState(
      {
        projectId: 'ccip',
        nodes: [mockObject<Node>({ id: 'node' })],
        userPreferences: USER_PREFERENCES,
      },
      currentState,
    )

    expect(result.projectId).toEqual('')
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
