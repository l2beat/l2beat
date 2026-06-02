import { expect } from 'earl'
import type { Node, State } from '../State'
import { buildStoredNodeLayout, reconcileHiddenFields } from './storage'

function node(id: string, color: number, extra: Partial<Node> = {}): Node {
  return {
    id,
    address: id,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: [],
    hiddenFields: [],
    box: { x: 0, y: 0, width: 100, height: 50 },
    color,
    hueShift: 0,
    data: null,
    isReachable: true,
    ...extra,
  }
}

function stateWith(nodes: Node[]): State {
  return {
    projectId: 'p',
    nodes,
    hidden: [],
    collapsedEntrypointGroups: [],
  } as unknown as State
}

describe(buildStoredNodeLayout.name, () => {
  it('persists manual colors but not entrypoint-derived ones', () => {
    const state = stateWith([
      node('manual', 5),
      node('default', 0),
      node('entrypoint', 3, { entrypointColors: [3] }),
      node('member', 2, { entrypointMemberOf: 'group-1' }),
    ])

    const { colors } = buildStoredNodeLayout(state)

    // Only the manually colored node is persisted; entrypoint-driven colors are
    // recomputed from the API each load, so persisting them would leave nodes
    // stuck in the entrypoint color after the entrypoint is removed.
    expect(colors).toEqual({ manual: 5 })
  })
})

describe(reconcileHiddenFields.name, () => {
  it('keeps entries that exist on the node', () => {
    const result = reconcileHiddenFields(['a', 'b', 'c'], ['a', 'c'])
    expect(result).toEqual(['a', 'c'])
  })

  it('drops stale entries no longer on the node', () => {
    const result = reconcileHiddenFields(['a', 'b'], ['a', 'removed', 'b'])
    expect(result).toEqual(['a', 'b'])
  })

  it('dedupes duplicates', () => {
    const result = reconcileHiddenFields(['a', 'b'], ['a', 'a', 'b', 'a'])
    expect(result).toEqual(['a', 'b'])
  })

  it('returns empty when no entries match', () => {
    const result = reconcileHiddenFields(['a', 'b'], ['x', 'y'])
    expect(result).toEqual([])
  })

  it('returns empty for empty hidden input', () => {
    const result = reconcileHiddenFields(['a', 'b'], [])
    expect(result).toEqual([])
  })

  it('returns empty when node has no fields', () => {
    const result = reconcileHiddenFields([], ['a', 'b'])
    expect(result).toEqual([])
  })
})
