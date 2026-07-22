import { expect } from 'earl'
import {
  getClusterLabelStyle,
  getExistingRelationGraphSelection,
  getRelationGraphFocus,
  mostCommonDeployedSymbol,
  type RelationGraph,
  type RelationGraphFocus,
  type RelationGraphNode,
  type RelationGraphRelation,
  relationId,
  searchRelationGraphNodes,
  tokenId,
} from './relationGraphModel'

describe(mostCommonDeployedSymbol.name, () => {
  it('uses the most common deployed symbol and ignores missing endpoints', () => {
    expect(
      mostCommonDeployedSymbol([
        node('ethereum:1', 'USDC'),
        node('base:1', 'USDT'),
        node('arbitrum:1', 'USDC'),
        missingNode('optimism:1'),
      ]),
    ).toEqual('USDC')
  })

  it('uses symbol order as a stable tie-breaker', () => {
    expect(
      mostCommonDeployedSymbol([
        node('ethereum:1', 'WETH'),
        node('base:1', 'ETH'),
      ]),
    ).toEqual('ETH')
  })

  it('preserves the symbol casing', () => {
    expect(mostCommonDeployedSymbol([node('ethereum:1', 'stETH')])).toEqual(
      'stETH',
    )
  })
})

describe(getClusterLabelStyle.name, () => {
  it('stops increasing labels below the minimum scale', () => {
    expect(getClusterLabelStyle(0.25)).toEqual({
      fontSize: 72,
      strokeWidth: 16,
      opacity: 0.8,
    })
    expect(getClusterLabelStyle(0.1).fontSize).toEqual(72)
    expect(getClusterLabelStyle(0.1).strokeWidth).toEqual(16)
  })

  it('hides labels at extreme zoom-out', () => {
    expect(getClusterLabelStyle(0.05).opacity).toEqual(0)
  })

  it('rejects invalid scales', () => {
    expect(() => getClusterLabelStyle(0)).toThrow(
      'Graph scale must be a positive finite number',
    )
  })
})

const relations = [
  relation('ethereum', '0xaaa', 'base', '0xbbb', 'first'),
  relation('ethereum', '0xaaa', 'optimism', '0xccc', 'second'),
  relation('arbitrum', '0xddd', 'linea', '0xeee', 'unrelated'),
]
const graph: RelationGraph = {
  nodes: [
    graphNode('ethereum', '0xaaa'),
    graphNode('base', '0xbbb'),
    graphNode('optimism', '0xccc'),
    graphNode('arbitrum', '0xddd'),
    graphNode('linea', '0xeee'),
  ],
  relations,
}

describe(getExistingRelationGraphSelection.name, () => {
  it('keeps selections that exist in the graph', () => {
    const selectedNode = graph.nodes[0]
    if (selectedNode === undefined) throw new Error('Missing test node')
    const selection = { type: 'node', id: selectedNode.id } as const
    expect(getExistingRelationGraphSelection(graph, selection)).toEqual(
      selection,
    )
  })

  it('clears selections that no longer exist in the graph', () => {
    expect(
      getExistingRelationGraphSelection(graph, {
        type: 'node',
        id: 'missing:node',
      }),
    ).toEqual(undefined)
    expect(
      getExistingRelationGraphSelection(graph, {
        type: 'relation',
        id: 'missing:relation',
      }),
    ).toEqual(undefined)
  })
})

describe(searchRelationGraphNodes.name, () => {
  const nodes = [
    node('ethereum:0xaaa', 'USDC'),
    node('base:0xbbb', 'USDC'),
    node('arbitrum:0xccc', 'USDT'),
    missingNode('optimism:0xddd'),
  ]

  it('searches deployed tokens by symbol, chain, and address', () => {
    expect(
      searchRelationGraphNodes(nodes, 'usdc').map((node) => node.id),
    ).toEqual(['base:0xbbb', 'ethereum:0xaaa'])
    expect(
      searchRelationGraphNodes(nodes, 'base usdc').map((node) => node.id),
    ).toEqual(['base:0xbbb'])
    expect(
      searchRelationGraphNodes(nodes, '0xCCC').map((node) => node.id),
    ).toEqual(['arbitrum:0xccc'])
    expect(
      searchRelationGraphNodes(nodes, 'arbitrum:0xccc').map((node) => node.id),
    ).toEqual(['arbitrum:0xccc'])
  })

  it('ignores missing endpoints and queries shorter than two characters', () => {
    expect(searchRelationGraphNodes(nodes, '0xddd')).toEqual([])
    expect(searchRelationGraphNodes(nodes, 'u')).toEqual([])
  })
})

describe(getRelationGraphFocus.name, () => {
  it('collects a selected node, its neighbors, and its incident relations', () => {
    const focus = requiredFocus(
      getRelationGraphFocus(graph, {
        type: 'node',
        id: tokenId('ethereum', '0xaaa'),
      }),
    )

    expect([...focus.nodeIds].sort()).toEqual(
      [
        tokenId('ethereum', '0xaaa'),
        tokenId('base', '0xbbb'),
        tokenId('optimism', '0xccc'),
      ].sort(),
    )
    expect([...focus.relationIds].sort()).toEqual(
      relations.slice(0, 2).map(relationId).sort(),
    )
  })

  it('collects only the endpoints of a selected relation', () => {
    const selectedRelation = relations[1]
    if (selectedRelation === undefined) {
      throw new Error('Missing test relation')
    }
    const focus = requiredFocus(
      getRelationGraphFocus(graph, {
        type: 'relation',
        id: relationId(selectedRelation),
      }),
    )

    expect([...focus.nodeIds].sort()).toEqual(
      [
        tokenId(
          selectedRelation.tokenFromChain,
          selectedRelation.tokenFromAddress,
        ),
        tokenId(selectedRelation.tokenToChain, selectedRelation.tokenToAddress),
      ].sort(),
    )
    expect([...focus.relationIds]).toEqual([relationId(selectedRelation)])
  })
})

function node(id: string, symbol: string): RelationGraphNode {
  const [chain, address] = id.split(':')
  if (chain === undefined || address === undefined) {
    throw new Error(`Invalid test node id ${id}`)
  }
  return {
    id,
    symbol,
    chain,
    address,
    isDeployed: true,
  }
}

function missingNode(id: string): RelationGraphNode {
  const [chain, address] = id.split(':')
  if (chain === undefined || address === undefined) {
    throw new Error(`Invalid test node id ${id}`)
  }
  return {
    id,
    symbol: null,
    chain,
    address,
    isDeployed: false,
  }
}

function graphNode(chain: string, address: string): RelationGraphNode {
  return {
    id: tokenId(chain, address),
    symbol: 'TOKEN',
    chain,
    address,
    isDeployed: true,
  }
}

function relation(
  tokenFromChain: string,
  tokenFromAddress: string,
  tokenToChain: string,
  tokenToAddress: string,
  plugin: string,
): RelationGraphRelation {
  return {
    tokenFromChain,
    tokenFromAddress,
    tokenToChain,
    tokenToAddress,
    plugin,
    bridgeType: 'lockAndMint',
    isConflict: false,
  }
}

function requiredFocus(
  focus: RelationGraphFocus | undefined,
): RelationGraphFocus {
  if (focus === undefined) throw new Error('Expected graph focus')
  return focus
}
