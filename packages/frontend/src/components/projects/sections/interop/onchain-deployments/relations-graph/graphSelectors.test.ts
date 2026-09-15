import { expect } from 'earl'
import type {
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import {
  getActiveBacking,
  getDirectlyBackedNodes,
  getRelationsPaths,
  getSameChainComparisons,
  getUnconnectedIds,
  hasTokenRelations,
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

describe(hasTokenRelations.name, () => {
  it('needs an edge or a cluster', () => {
    expect(hasTokenRelations(graph)).toEqual(true)
    expect(
      hasTokenRelations({ nodes: graph.nodes.slice(0, 2), edges: [] }),
    ).toEqual(false)
    expect(
      hasTokenRelations({ nodes: graph.nodes.slice(4, 5), edges: [] }),
    ).toEqual(true)
  })
})

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
      arbitrum?.ranked.map((item) => [item.node.id, item.selected, item.rank]),
    ).toEqual([
      ['A', false, 1],
      ['C', true, 2],
    ])

    const cluster = getSameChainComparisons(
      graph,
      graph.nodes[4] as InteropTokenRelationsNode,
    )
    expect(
      cluster.map((c) => [
        c.chain.id,
        c.ranked.filter((item) => item.selected).map((item) => item.rank),
      ]),
    ).toEqual([['base', [2]]])
  })

  it('compares each chain once when the selected cluster has several deployments on it', () => {
    const selected = node('cluster', [
      ['ethereum', '0xe1', 10],
      ['arbitrum', '0xa1', 5],
      ['ethereum', '0xe2', 30],
    ])
    const comparisons = getSameChainComparisons(
      {
        nodes: [
          selected,
          node('ethereum-peer', [['ethereum', '0xe3', 20]]),
          node('arbitrum-peer', [['arbitrum', '0xa2', 10]]),
        ],
        edges: [],
      },
      selected,
    )

    expect(comparisons.map((comparison) => comparison.chain.id)).toEqual([
      'ethereum',
      'arbitrum',
    ])
    expect(
      comparisons[0]?.ranked.map((item) => [
        item.deployment.address,
        item.selected,
        item.rank,
      ]),
    ).toEqual([
      ['0xe2', true, 1],
      ['0xe3', false, 2],
      ['0xe1', true, 3],
    ])
  })

  it('ranks zero volume but leaves unmeasured deployments unranked', () => {
    const selected = node('selected', [['ethereum', '0xe1', null]])
    const [comparison] = getSameChainComparisons(
      {
        nodes: [selected, node('peer', [['ethereum', '0xe2', 0]])],
        edges: [],
      },
      selected,
    )

    expect(comparison?.ranked.map((item) => [item.node.id, item.rank])).toEqual(
      [
        ['peer', 1],
        ['selected', undefined],
      ],
    )
  })
})

describe(getDirectlyBackedNodes.name, () => {
  it('lists direct neighbors in volume order without their descendants', () => {
    const direct = getDirectlyBackedNodes(graph, 'E')
    expect(direct.map((d) => d.node.id)).toEqual(['A', 'B'])
  })

  it('keeps every direct neighbor when one branch exhausts the downstream path limit', () => {
    const descendants = Array.from({ length: 16 }, (_, index) =>
      node(`leaf-${index}`, [['ethereum', `0x${index}`, 1]]),
    )
    const graphWithManyPaths = {
      nodes: [...graph.nodes, ...descendants],
      edges: [
        ...graph.edges,
        ...descendants.map((node) => ({
          from: 'A',
          to: node.id,
          bridges: [],
        })),
      ],
    }
    const direct = getDirectlyBackedNodes(graphWithManyPaths, 'E')

    expect(direct.map((item) => item.node.id)).toEqual(['A', 'B'])
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
      minters: [],
      isSupported: true,
      volume,
      transferCount: null,
      avgDuration: null,
    })),
  }
}
