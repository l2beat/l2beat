import { expect } from 'earl'
import type {
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import {
  getActiveBacking,
  getRelationsPaths,
  getSameChainComparisons,
  getUnconnectedIds,
  groupBackedPaths,
} from './graphSelectors'

// E backs A and B; A backs C; X and Y are a cluster; L is alone.
const graph: InteropTokenRelationsGraph = {
  nodes: [
    node('E', [['ethereum', '0xe1', 100]]),
    node('A', [['arbitrum', '0xa1', 50]]),
    node('B', [['base', '0xb1', 10]]),
    node('C', [['arbitrum', '0xc1', 5]]),
    node('X', [
      ['optimism', '0x01', 1],
      ['base', '0xb2', 1],
    ]),
    node('L', [['linea', '0x11', null]]),
  ],
  edges: [
    { from: 'E', to: 'A', bridges: [] },
    { from: 'E', to: 'B', bridges: [] },
    { from: 'A', to: 'C', bridges: [] },
  ],
}

describe(getUnconnectedIds.name, () => {
  it('excludes clusters and anything on an edge', () => {
    expect([...getUnconnectedIds(graph)]).toEqual(['L'])
  })
})

describe(getActiveBacking.name, () => {
  it('follows backers transitively and the backed nodes one step', () => {
    const active = getActiveBacking(graph.edges, 'A')
    expect([...active.nodeIds]).toEqualUnsorted(['A', 'E', 'C'])
    expect([...active.edgeKeys]).toEqualUnsorted(['E->A', 'A->C'])
  })
})

describe(getRelationsPaths.name, () => {
  it('lists source-first backing paths and node-first backed paths', () => {
    const ids = (paths: ReturnType<typeof getRelationsPaths>) =>
      paths.map((path) => path.nodes.map((node) => node.id).join('>'))

    expect(ids(getRelationsPaths(graph, 'C', 'backing'))).toEqual(['E>A>C'])
    expect(ids(getRelationsPaths(graph, 'E', 'backed'))).toEqual([
      'E>A>C',
      'E>B',
    ])
    expect(getRelationsPaths(graph, 'E', 'backing')).toEqual([])
  })
})

describe(getSameChainComparisons.name, () => {
  it('ranks every deployment on the chain and places the selected one', () => {
    const [arbitrum] = getSameChainComparisons(
      graph,
      graph.nodes[3] as InteropTokenRelationsNode,
    )
    expect(
      arbitrum?.ranked.map((item) => [item.node.id, item.selected]),
    ).toEqual([
      ['A', false],
      ['C', true],
    ])
    expect(arbitrum?.rank).toEqual(2)

    const cluster = getSameChainComparisons(
      graph,
      graph.nodes[4] as InteropTokenRelationsNode,
    )
    expect(cluster.map((c) => [c.chain.id, c.rank])).toEqual([['base', 2]])
  })
})

describe(groupBackedPaths.name, () => {
  it('lists each directly backed node once and keeps longer paths apart', () => {
    const { direct, nested } = groupBackedPaths(
      getRelationsPaths(graph, 'E', 'backed'),
    )
    expect(direct.map((d) => d.node.id)).toEqual(['A', 'B'])
    expect(nested.map((p) => p.nodes.map((n) => n.id))).toEqual([
      ['E', 'A', 'C'],
    ])
  })
})

function node(
  id: string,
  deployments: [string, string, number | null][],
): InteropTokenRelationsNode {
  return {
    id,
    volume: deployments[0]?.[2] ?? null,
    transferCount: null,
    avgDuration: null,
    bridges: [],
    deployments: deployments.map(([chain, address, volume]) => ({
      chain: { id: chain, name: chain, iconUrl: undefined },
      address,
      symbol: 'USDC',
      explorerUrl: undefined,
      volume,
      transferCount: null,
      avgDuration: null,
    })),
  }
}
