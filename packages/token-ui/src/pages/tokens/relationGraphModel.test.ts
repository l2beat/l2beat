import { expect } from 'earl'
import {
  filterTokensWithoutRelations,
  getClusterLabelOpacity,
  getExistingRelationGraphSelection,
  getNodeIdsOutsideRelationChains,
  getNodeVisualScale,
  getRelationGraphFocus,
  mostCommonAbstractTokenId,
  mostCommonDeployedSymbol,
  type RelationGraph,
  type RelationGraphFocus,
  type RelationGraphNode,
  type RelationGraphRelation,
  relationId,
  relationIsDirectional,
  relationRoleLabel,
  searchRelationGraphNodes,
  sourceId,
  targetId,
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

describe(mostCommonAbstractTokenId.name, () => {
  it('uses the most common assignment and ignores unassigned nodes', () => {
    expect(
      mostCommonAbstractTokenId([
        node('ethereum:1', 'USDC', 'AT-USDC'),
        node('base:1', 'USDC', 'AT-OTHER'),
        node('arbitrum:1', 'USDC', 'AT-USDC'),
        node('optimism:1', 'USDC'),
        missingNode('linea:1'),
      ]),
    ).toEqual('AT-USDC')
  })

  it('uses id order as a stable tie-breaker', () => {
    expect(
      mostCommonAbstractTokenId([
        node('ethereum:1', 'WETH', 'AT-WETH'),
        node('base:1', 'ETH', 'AT-ETH'),
      ]),
    ).toEqual('AT-ETH')
  })

  it('returns undefined when nothing is assigned', () => {
    expect(mostCommonAbstractTokenId([node('ethereum:1', 'USDC')])).toEqual(
      undefined,
    )
  })
})

describe(getNodeIdsOutsideRelationChains.name, () => {
  it('returns only nodes without relations on chains no relation touches', () => {
    const graph: RelationGraph = {
      nodes: [
        node('ethereum:0xaaa', 'USDC', 'AT-USDC'),
        node('base:0xbbb', 'USDC', 'AT-USDC'),
        // Without relations, but base appears among relation endpoints.
        {
          ...node('base:0xccc', 'USDC.e', 'AT-USDC'),
          hasRelations: false,
        },
        // Without relations on a chain absent from every relation.
        {
          ...node('polygon:0xddd', 'USDC', 'AT-USDC'),
          hasRelations: false,
        },
        // A relation endpoint is never hidden, whatever its chain — this
        // cannot occur in real payloads, where endpoint chains are by
        // definition relation chains.
        node('polygon:0xeee', 'USDC', 'AT-USDC'),
      ],
      relations: [relation('ethereum', '0xaaa', 'base', '0xbbb', 'plugin')],
    }

    expect(getNodeIdsOutsideRelationChains(graph)).toEqual(
      new Set(['polygon:0xddd']),
    )
  })
})

describe(filterTokensWithoutRelations.name, () => {
  const endpointA = node('ethereum:0xaaa', 'USDC', 'AT-USDC')
  const endpointB = node('base:0xbbb', 'USDC', 'AT-USDC')
  const onSupportedChain = {
    ...node('base:0xccc', 'USDC.e', 'AT-USDC'),
    hasRelations: false,
  }
  const offSupportedChain = {
    ...node('polygon:0xddd', 'USDC', 'AT-USDC'),
    hasRelations: false,
  }
  const graph: RelationGraph = {
    nodes: [endpointA, endpointB, onSupportedChain, offSupportedChain],
    relations: [relation('ethereum', '0xaaa', 'base', '0xbbb', 'plugin')],
  }

  it('returns the graph unchanged when showing all', () => {
    expect(filterTokensWithoutRelations(graph, 'all')).toEqual(graph)
  })

  it('drops every node without relations when hiding them', () => {
    expect(filterTokensWithoutRelations(graph, 'hide').nodes).toEqual([
      endpointA,
      endpointB,
    ])
  })

  it('keeps only nodes without relations on relation chains in supported mode', () => {
    expect(filterTokensWithoutRelations(graph, 'supported').nodes).toEqual([
      endpointA,
      endpointB,
      onSupportedChain,
    ])
  })

  it('never filters relations', () => {
    expect(filterTokensWithoutRelations(graph, 'hide').relations).toEqual(
      graph.relations,
    )
  })
})

describe(getClusterLabelOpacity.name, () => {
  it('keeps labels visible at overview and zoomed-in scales', () => {
    expect(getClusterLabelOpacity(0.3)).toEqual(0.8)
    expect(getClusterLabelOpacity(1)).toEqual(0.8)
    expect(getClusterLabelOpacity(2)).toEqual(0.8)
  })

  it('fades labels away at extreme zoom-out', () => {
    // The exact fade thresholds are tuning knobs; the contract is only that
    // labels are gone once the zoom-out is extreme enough.
    expect(getClusterLabelOpacity(0.01)).toEqual(0)
  })

  it('rejects invalid scales', () => {
    expect(() => getClusterLabelOpacity(0)).toThrow(
      'Graph scale must be a positive finite number',
    )
  })
})

describe(getNodeVisualScale.name, () => {
  it('caps node growth above 1.2x zoom', () => {
    expect(getNodeVisualScale(0.5)).toEqual(1)
    expect(getNodeVisualScale(1.2)).toEqual(1)
    expect(getNodeVisualScale(2.4)).toEqual(0.5)
  })
})

describe(relationIsDirectional.name, () => {
  it('only treats Lock & Mint relations with an identified locked token as directional', () => {
    expect(
      relationIsDirectional(
        relation('ethereum', '0xaaa', 'base', '0xbbb', 'lock', 'lockAndMint'),
      ),
    ).toEqual(true)
    expect(
      relationIsDirectional(
        relation('ethereum', '0xaaa', 'base', '0xbbb', 'burn', 'burnAndMint'),
      ),
    ).toEqual(false)
    // Drawing an arrow here would mean guessing which token is the original.
    expect(
      relationIsDirectional(
        relation(
          'ethereum',
          '0xaaa',
          'base',
          '0xbbb',
          'lock',
          'lockAndMint',
          null,
        ),
      ),
    ).toEqual(false)
  })
})

describe('relation endpoint order', () => {
  it('draws a directional relation from the locked token to the minted one', () => {
    // The A/B slots are lexicographic, so the arrow must follow `lockedToken`
    // rather than the slot order.
    const lockedIsSecondEndpoint = relation(
      'base',
      '0xbbb',
      'ethereum',
      '0xaaa',
      'lock',
      'lockAndMint',
      'B',
    )

    expect(sourceId(lockedIsSecondEndpoint)).toEqual(
      tokenId('ethereum', '0xaaa'),
    )
    expect(targetId(lockedIsSecondEndpoint)).toEqual(tokenId('base', '0xbbb'))
  })

  it('keeps the stored order for relations without a direction', () => {
    const symmetric = relation(
      'base',
      '0xbbb',
      'ethereum',
      '0xaaa',
      'burn',
      'burnAndMint',
      null,
    )

    expect(sourceId(symmetric)).toEqual(tokenId('base', '0xbbb'))
    expect(targetId(symmetric)).toEqual(tokenId('ethereum', '0xaaa'))
  })
})

describe(relationRoleLabel.name, () => {
  it('labels each endpoint by what it is to the other', () => {
    const lockAndMint = relation(
      'base',
      '0xbbb',
      'ethereum',
      '0xaaa',
      'lock',
      'lockAndMint',
      'B',
    )

    expect(
      relationRoleLabel(lockAndMint, tokenId('ethereum', '0xaaa')),
    ).toEqual('Locked')
    expect(relationRoleLabel(lockAndMint, tokenId('base', '0xbbb'))).toEqual(
      'Minted',
    )
    // A burn-and-mint pair is symmetric, so each endpoint's role is Minted;
    // the relation type label is what shows the symmetry.
    expect(
      relationRoleLabel(
        relation('base', '0xbbb', 'ethereum', '0xaaa', 'burn', 'burnAndMint'),
        tokenId('base', '0xbbb'),
      ),
    ).toEqual('Minted')
    expect(
      relationRoleLabel(
        relation(
          'base',
          '0xbbb',
          'ethereum',
          '0xaaa',
          'lock',
          'lockAndMint',
          null,
        ),
        tokenId('base', '0xbbb'),
      ),
    ).toEqual('Unknown role')
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

  it('clears a relation selection that was deleted from the graph view', () => {
    const deletedRelation = relations[0]
    if (deletedRelation === undefined) throw new Error('Missing test relation')
    const selection = {
      type: 'relation',
      id: relationId(deletedRelation),
    } as const

    expect(getExistingRelationGraphSelection(graph, selection)).toEqual(
      selection,
    )
    expect(
      getExistingRelationGraphSelection(
        graph,
        selection,
        new Set([relationId(deletedRelation)]),
      ),
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
        tokenId(selectedRelation.tokenAChain, selectedRelation.tokenAAddress),
        tokenId(selectedRelation.tokenBChain, selectedRelation.tokenBAddress),
      ].sort(),
    )
    expect([...focus.relationIds]).toEqual([relationId(selectedRelation)])
  })

  it('skips deleted relations when collecting a node neighborhood', () => {
    const deletedRelation = relations[0]
    const keptRelation = relations[1]
    if (deletedRelation === undefined || keptRelation === undefined) {
      throw new Error('Missing test relation')
    }
    const focus = requiredFocus(
      getRelationGraphFocus(
        graph,
        { type: 'node', id: tokenId('ethereum', '0xaaa') },
        new Set([relationId(deletedRelation)]),
      ),
    )

    expect([...focus.nodeIds].sort()).toEqual(
      [tokenId('ethereum', '0xaaa'), tokenId('optimism', '0xccc')].sort(),
    )
    expect([...focus.relationIds]).toEqual([relationId(keptRelation)])
  })

  it('rejects a selected relation that was deleted', () => {
    const deletedRelation = relations[0]
    if (deletedRelation === undefined) throw new Error('Missing test relation')

    expect(() =>
      getRelationGraphFocus(
        graph,
        { type: 'relation', id: relationId(deletedRelation) },
        new Set([relationId(deletedRelation)]),
      ),
    ).toThrow(
      `Selected relation ${relationId(deletedRelation)} is not in graph`,
    )
  })
})

function node(
  id: string,
  symbol: string,
  abstractTokenId: string | null = null,
): RelationGraphNode {
  const [chain, address] = id.split(':')
  if (chain === undefined || address === undefined) {
    throw new Error(`Invalid test node id ${id}`)
  }
  return {
    id,
    symbol,
    chain,
    address,
    abstractTokenId,
    isDeployed: true,
    hasRelations: true,
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
    abstractTokenId: null,
    isDeployed: false,
    hasRelations: true,
  }
}

function graphNode(chain: string, address: string): RelationGraphNode {
  return {
    id: tokenId(chain, address),
    symbol: 'TOKEN',
    chain,
    address,
    abstractTokenId: null,
    isDeployed: true,
    hasRelations: true,
  }
}

function relation(
  tokenAChain: string,
  tokenAAddress: string,
  tokenBChain: string,
  tokenBAddress: string,
  plugin: string,
  bridgeType: RelationGraphRelation['bridgeType'] = 'lockAndMint',
  lockedToken: RelationGraphRelation['lockedToken'] = 'A',
): RelationGraphRelation {
  return {
    tokenAChain,
    tokenAAddress,
    tokenBChain,
    tokenBAddress,
    plugin,
    bridgeType,
    lockedToken,
    isConflict: false,
  }
}

function requiredFocus(
  focus: RelationGraphFocus | undefined,
): RelationGraphFocus {
  if (focus === undefined) throw new Error('Expected graph focus')
  return focus
}
