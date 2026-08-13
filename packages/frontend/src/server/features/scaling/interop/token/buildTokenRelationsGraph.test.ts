import { expect } from 'earl'
import {
  buildTokenRelationsGraph,
  type TokenRelationsDeployment,
  type TokenRelationsRoute,
} from './buildTokenRelationsGraph'

describe(buildTokenRelationsGraph.name, () => {
  const eth = deployment('ethereum', '0xaaa', 'USDC')
  const arb = deployment('arbitrum', '0xbbb', 'USDC')
  const op = deployment('optimism', '0xccc', 'USDC')

  it('gives every deployment a node and marks untouched ones unconnected', () => {
    const graph = buildTokenRelationsGraph([eth, arb, op], [])

    expect(graph.nodes.map((n) => n.id)).toEqual([
      'arbitrum|0xbbb',
      'ethereum|0xaaa',
      'optimism|0xccc',
    ])
    expect(graph.edges).toEqual([])
    expect(graph.unconnectedNodeIds).toEqual([
      'arbitrum|0xbbb',
      'ethereum|0xaaa',
      'optimism|0xccc',
    ])
  })

  it('collapses symmetric relations into one burn-mint node', () => {
    const graph = buildTokenRelationsGraph(
      [eth, arb, op],
      [route(eth, arb, { bridgeType: 'burnAndMint' })],
    )

    const grouped = graph.nodes.find((n) => n.members.length > 1)
    expect(grouped?.id).toEqual('arbitrum|0xbbb')
    expect(grouped?.members.map((m) => m.chain)).toEqual([
      'arbitrum',
      'ethereum',
    ])
    expect(graph.nodes.length).toEqual(2)
    expect(graph.unconnectedNodeIds).toEqual(['optimism|0xccc'])
  })

  it('points the backing edge at the locked endpoint, not the slot order', () => {
    // `optimism` sorts after `ethereum`, so it lands in slot B; making it the
    // locked one must still put it on the backing side.
    const graph = buildTokenRelationsGraph(
      [eth, op],
      [route(eth, op, { bridgeType: 'lockAndMint', lockedToken: 'B' })],
    )

    expect(graph.edges).toEqual([
      {
        from: 'optimism|0xccc',
        to: 'ethereum|0xaaa',
        kind: 'backs',
        sources: [
          {
            plugin: 'bridge',
            bridgeType: 'lockAndMint',
            chains: ['ethereum', 'optimism'],
          },
        ],
      },
    ])
    expect(graph.unconnectedNodeIds).toEqual([])
  })

  it('omits a lock-mint relation with no identified locked side', () => {
    const graph = buildTokenRelationsGraph(
      [eth, op],
      [route(eth, op, { bridgeType: 'lockAndMint', lockedToken: null })],
    )

    expect(graph.edges).toEqual([])
    expect(graph.unconnectedNodeIds).toEqual([
      'ethereum|0xaaa',
      'optimism|0xccc',
    ])
  })

  it('prefers a known direction over an unidentified one for the same pair', () => {
    const graph = buildTokenRelationsGraph(
      [eth, op],
      [
        route(eth, op, { bridgeType: 'lockAndMint', lockedToken: null }),
        route(eth, op, {
          bridgeType: 'lockAndMint',
          lockedToken: 'A',
          plugin: 'other',
        }),
      ],
    )

    expect(graph.edges.map((e) => [e.kind, e.from, e.to])).toEqual([
      ['backs', 'ethereum|0xaaa', 'optimism|0xccc'],
    ])
  })

  it('omits contradictory backing directions', () => {
    const graph = buildTokenRelationsGraph(
      [eth, op],
      [
        route(eth, op, { bridgeType: 'lockAndMint', lockedToken: 'A' }),
        route(eth, op, {
          bridgeType: 'lockAndMint',
          lockedToken: 'B',
          plugin: 'other',
        }),
      ],
    )

    expect(graph.edges).toEqual([])
    expect(graph.unconnectedNodeIds).toEqual([
      'ethereum|0xaaa',
      'optimism|0xccc',
    ])
  })

  it('drops relations that stay inside one burn-mint node', () => {
    const graph = buildTokenRelationsGraph(
      [eth, arb],
      [
        route(eth, arb, { bridgeType: 'burnAndMint' }),
        route(eth, arb, {
          bridgeType: 'lockAndMint',
          lockedToken: 'A',
          plugin: 'other',
        }),
      ],
    )

    expect(graph.nodes.length).toEqual(1)
    expect(graph.edges).toEqual([])
  })

  it('keeps what puts a group in a burn-mint relation on the group itself', () => {
    const graph = buildTokenRelationsGraph(
      [eth, arb, op],
      [
        route(eth, arb, { bridgeType: 'burnAndMint' }),
        route(arb, op, { bridgeType: 'burnAndMint', plugin: 'other' }),
      ],
    )

    expect(graph.nodes.length).toEqual(1)
    expect(graph.nodes[0]?.sources.map((s) => s.plugin)).toEqual([
      'bridge',
      'other',
    ])
  })

  it('leaves a lone deployment with no burn-mint relation', () => {
    const graph = buildTokenRelationsGraph(
      [eth, op],
      [route(eth, op, { bridgeType: 'lockAndMint', lockedToken: 'A' })],
    )

    expect(graph.nodes.every((n) => n.sources.length === 0)).toEqual(true)
  })

  it('merges the bridges behind parallel relations into one edge', () => {
    const graph = buildTokenRelationsGraph(
      [eth, op],
      [
        route(eth, op, { bridgeType: 'lockAndMint', lockedToken: 'A' }),
        route(eth, op, {
          bridgeType: 'lockAndMint',
          lockedToken: 'A',
          plugin: 'other',
        }),
        route(eth, op, {
          bridgeType: 'lockAndMint',
          lockedToken: 'A',
          plugin: 'other',
        }),
      ],
    )

    expect(graph.edges.length).toEqual(1)
    expect(graph.edges[0]?.sources.map((s) => s.plugin)).toEqual([
      'bridge',
      'other',
    ])
  })

  it('ignores relations reaching outside the given deployments', () => {
    const foreign = deployment('base', '0xddd', 'USDC')
    const graph = buildTokenRelationsGraph(
      [eth, op],
      [
        route(eth, foreign, { bridgeType: 'lockAndMint', lockedToken: 'A' }),
        route(eth, op, { bridgeType: 'lockAndMint', lockedToken: 'A' }),
      ],
    )

    expect(graph.nodes.map((n) => n.id)).toEqual([
      'ethereum|0xaaa',
      'optimism|0xccc',
    ])
    expect(graph.edges.length).toEqual(1)
  })

  it('is independent of the order relations arrive in', () => {
    const routes = [
      route(eth, arb, { bridgeType: 'burnAndMint' }),
      route(arb, op, { bridgeType: 'burnAndMint', plugin: 'other' }),
    ]
    const forward = buildTokenRelationsGraph([eth, arb, op], routes)
    const backward = buildTokenRelationsGraph(
      [eth, arb, op],
      [...routes].reverse(),
    )

    expect(forward).toEqual(backward)
  })
})

function deployment(
  chain: string,
  address: string,
  symbol: string,
): TokenRelationsDeployment {
  return { chain, address, symbol }
}

/**
 * Mirrors `normalizeTokenRelation`: the endpoints are stored in lexicographic
 * order, so `lockedToken` refers to slots the caller does not choose.
 */
function route(
  first: TokenRelationsDeployment,
  second: TokenRelationsDeployment,
  overrides: Partial<TokenRelationsRoute> = {},
): TokenRelationsRoute {
  const ordered = [first, second].toSorted((a, b) =>
    `${a.chain}|${a.address}`.localeCompare(`${b.chain}|${b.address}`),
  )
  const [a, b] = ordered as [TokenRelationsDeployment, TokenRelationsDeployment]
  return {
    tokenAChain: a.chain,
    tokenAAddress: a.address,
    tokenBChain: b.chain,
    tokenBAddress: b.address,
    plugin: 'bridge',
    bridgeType: 'burnAndMint',
    lockedToken: null,
    ...overrides,
  }
}
