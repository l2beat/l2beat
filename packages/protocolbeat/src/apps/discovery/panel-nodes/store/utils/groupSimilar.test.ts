import { expect } from 'earl'
import type { Node } from '../State'
import { computeSimilarityGroups, groupSimilarLayout } from './groupSimilar'

function field(target: string): Node['fields'][number] {
  return {
    name: target,
    target,
    box: { x: 0, y: 0, width: 0, height: 0 },
    connection: {
      from: { direction: 'left', x: 0, y: 0 },
      to: { direction: 'left', x: 0, y: 0 },
    },
  }
}

function node(
  id: string,
  keys: {
    sourceKey?: string
    valuesShapeKey?: string
    addressType?: Node['addressType']
    references?: string[]
  } = {},
): Node {
  return {
    id,
    address: id,
    isInitial: false,
    hasTemplate: false,
    addressType: keys.addressType ?? 'Contract',
    name: id,
    fields: (keys.references ?? []).map(field),
    hiddenFields: [],
    box: { x: 0, y: 0, width: 100, height: 50 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    sourceKey: keys.sourceKey,
    valuesShapeKey: keys.valuesShapeKey,
  }
}

describe(computeSimilarityGroups.name, () => {
  it('groups nodes sharing a value-shape key and orders by size', () => {
    const nodes = [
      node('market1', { valuesShapeKey: '::a,b' }),
      node('vault1', { valuesShapeKey: 'tpl::x', sourceKey: 's1' }),
      node('market2', { valuesShapeKey: '::a,b' }),
      node('vault2', { valuesShapeKey: 'tpl::x', sourceKey: 's1' }),
      node('market3', { valuesShapeKey: '::a,b' }),
      node('lonely', {}),
    ]

    const groups = computeSimilarityGroups(nodes)

    // markets (3) first, then vaults (2), then the singleton column.
    expect(groups.map((g) => g.map((n) => n.id))).toEqual([
      ['market1', 'market2', 'market3'],
      ['vault1', 'vault2'],
      ['lonely'],
    ])
  })

  it('unions transitively across source and value keys', () => {
    // a~b by source, b~c by value -> all one group.
    const nodes = [
      node('a', { sourceKey: 'src' }),
      node('b', { sourceKey: 'src', valuesShapeKey: 'val' }),
      node('c', { valuesShapeKey: 'val' }),
    ]

    const groups = computeSimilarityGroups(nodes)

    expect(groups).toHaveLength(1)
    expect(groups[0]?.map((n) => n.id).sort()).toEqual(['a', 'b', 'c'])
  })

  it('puts all dissimilar non-EOA nodes in a single trailing column', () => {
    const nodes = [node('a'), node('b', { sourceKey: 'unique' })]
    const groups = computeSimilarityGroups(nodes)
    expect(groups.map((g) => g.map((n) => n.id))).toEqual([['a', 'b']])
  })

  it('puts "other" before a rightmost column grouping EOAs', () => {
    const nodes = [
      node('m1', { valuesShapeKey: '::a' }),
      node('m2', { valuesShapeKey: '::a' }),
      node('contract'),
      node('eoa1', { addressType: 'EOA' }),
      node('eoa2', { addressType: 'EOAPermissioned' }),
    ]

    const groups = computeSimilarityGroups(nodes)

    expect(groups.map((g) => g.map((n) => n.id))).toEqual([
      ['m1', 'm2'], // largest similarity group, leftmost
      ['contract'], // "other" — dissimilar non-EOA nodes
      ['eoa1', 'eoa2'], // EOAs, rightmost
    ])
  })

  it('orders nodes within a column by how many others reference them', () => {
    const nodes = [
      node('lonely', { valuesShapeKey: '::a' }),
      node('popular', { valuesShapeKey: '::a' }),
      node('r1', { references: ['popular'] }),
      node('r2', { references: ['popular'] }),
    ]

    const groups = computeSimilarityGroups(nodes)

    // 'popular' is referenced twice, 'lonely' not at all, so it comes first.
    expect(groups[0]?.map((n) => n.id)).toEqual(['popular', 'lonely'])
  })
})

describe(groupSimilarLayout.name, () => {
  it('stacks each group in its own column, left to right', () => {
    const nodes = [
      node('m1', { valuesShapeKey: '::a' }),
      node('m2', { valuesShapeKey: '::a' }),
      node('lonely'),
    ]

    const locations = groupSimilarLayout(nodes)

    // First column (the pair) shares an x; second member sits below the first.
    expect(locations.m1).toEqual({ x: 0, y: 0 })
    expect(locations.m2).toEqual({ x: 0, y: 90 })
    // Singleton column is further right and starts at the top.
    const lonely = locations.lonely
    expect(lonely).not.toEqual(undefined)
    expect(lonely?.x ?? 0).toBeGreaterThan(0)
    expect(lonely?.y).toEqual(0)
  })
})
