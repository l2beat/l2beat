import { expect } from 'earl'
import type { TokenRelationsRoute } from '../scaling/interop/token/buildTokenRelationsGraph'
import {
  type BuildTokenGraphTilesInput,
  buildTokenGraphTiles,
} from './buildTokenGraphTiles'

describe(buildTokenGraphTiles.name, () => {
  it('groups deployments by their abstract token', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [token('aaa', 'USDC'), token('bbb', 'USDT')],
        deployedTokens: [
          deployment('ethereum', '0x1', 'aaa'),
          deployment('arbitrum', '0x2', 'aaa'),
          deployment('ethereum', '0x3', 'bbb'),
        ],
      }),
    )

    expect(
      tiles.map((t) => [t.symbol, t.deployments, t.chains]),
    ).toEqualUnsorted([
      ['USDC', 2, 2],
      ['USDT', 1, 1],
    ])
  })

  it('skips tokens with no deployments', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [token('aaa', 'USDC'), token('bbb', 'GHOST')],
        deployedTokens: [deployment('ethereum', '0x1', 'aaa')],
      }),
    )

    expect(tiles.map((t) => t.symbol)).toEqual(['USDC'])
  })

  it('keeps a token with deployments but no relations, as unconnected nodes', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [token('aaa', 'USDC')],
        deployedTokens: [
          deployment('ethereum', '0x1', 'aaa'),
          deployment('arbitrum', '0x2', 'aaa'),
        ],
      }),
    )

    const tile = tiles[0]
    expect(tile?.graph.edges).toEqual([])
    expect(tile?.graph.unconnectedNodeIds.length).toEqual(2)
  })

  it('counts a burn-mint-only token as having relations, despite no edges', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [token('aaa', 'USDC')],
        deployedTokens: [
          deployment('ethereum', '0x1', 'aaa'),
          deployment('arbitrum', '0x2', 'aaa'),
        ],
        routes: [
          route('arbitrum', '0x2', 'ethereum', '0x1', {
            bridgeType: 'burnAndMint',
          }),
        ],
      }),
    )

    // Both collapse into one node, so nothing is drawn between anything —
    // but "these two are burn-mint" is still the relation.
    expect(tiles[0]?.graph.edges).toEqual([])
    expect(tiles[0]?.graph.nodes.length).toEqual(1)
    expect(tiles[0]?.hasRelations).toEqual(true)
  })

  it('marks a token with no relations at all', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [token('aaa', 'USDC')],
        deployedTokens: [
          deployment('ethereum', '0x1', 'aaa'),
          deployment('arbitrum', '0x2', 'aaa'),
        ],
      }),
    )

    expect(tiles[0]?.hasRelations).toEqual(false)
  })

  it('draws the same node and edge counts as the full graph builder', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [token('aaa', 'USDC')],
        deployedTokens: [
          deployment('ethereum', '0x1', 'aaa'),
          deployment('arbitrum', '0x2', 'aaa'),
          deployment('base', '0x3', 'aaa'),
        ],
        routes: [
          // ethereum and arbitrum collapse into one burn-mint node, which then
          // backs base: 2 nodes, 1 edge.
          route('arbitrum', '0x2', 'ethereum', '0x1', {
            bridgeType: 'burnAndMint',
          }),
          route('arbitrum', '0x2', 'base', '0x3', {
            bridgeType: 'lockAndMint',
            lockedToken: 'A',
          }),
        ],
      }),
    )

    expect(tiles[0]?.graph.nodes.length).toEqual(2)
    expect(tiles[0]?.graph.edges.length).toEqual(1)
    const grouped = tiles[0]?.graph.nodes.find((n) => n.chains.length > 1)
    expect(grouped?.chains ?? []).toEqualUnsorted(['arbitrum', 'ethereum'])
  })

  it('ignores a relation reaching into a different token', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [token('aaa', 'USDC'), token('bbb', 'USDT')],
        deployedTokens: [
          deployment('ethereum', '0x1', 'aaa'),
          deployment('ethereum', '0x9', 'bbb'),
        ],
        routes: [
          route('ethereum', '0x1', 'ethereum', '0x9', {
            bridgeType: 'lockAndMint',
            lockedToken: 'A',
          }),
        ],
      }),
    )

    expect(tiles.every((t) => t.graph.edges.length === 0)).toEqual(true)
  })

  it('sorts by volume, falling back to symbol', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [
          token('aaa', 'AAA'),
          token('bbb', 'BBB'),
          token('ccc', 'CCC'),
        ],
        deployedTokens: [
          deployment('ethereum', '0x1', 'aaa'),
          deployment('ethereum', '0x2', 'bbb'),
          deployment('ethereum', '0x3', 'ccc'),
        ],
        volumeByTokenId: new Map([['bbb', 100]]),
      }),
    )

    expect(tiles.map((t) => t.symbol)).toEqual(['BBB', 'AAA', 'CCC'])
    expect(tiles[0]?.volume).toEqual(100)
    expect(tiles[1]?.volume).toEqual(null)
  })

  it('builds the token page slug from issuer and symbol', () => {
    const tiles = buildTokenGraphTiles(
      input({
        abstractTokens: [
          { id: 'aaa', symbol: 'USDC', issuer: 'circle', iconUrl: null },
        ],
        deployedTokens: [deployment('ethereum', '0x1', 'aaa')],
      }),
    )

    expect(tiles[0]?.slug).toEqual('circle-usdc')
  })
})

function input(
  overrides: Partial<BuildTokenGraphTilesInput>,
): BuildTokenGraphTilesInput {
  return {
    abstractTokens: [],
    deployedTokens: [],
    routes: [],
    volumeByTokenId: new Map(),
    ...overrides,
  }
}

function token(id: string, symbol: string) {
  return { id, symbol, issuer: null, iconUrl: null }
}

function deployment(chain: string, address: string, abstractTokenId: string) {
  return { chain, address, symbol: 'TOKEN', abstractTokenId }
}

/** Mirrors `normalizeTokenRelation`: endpoints stored in lexicographic order. */
function route(
  aChain: string,
  aAddress: string,
  bChain: string,
  bAddress: string,
  overrides: Partial<TokenRelationsRoute> = {},
): TokenRelationsRoute {
  const [a, b] = [
    { chain: aChain, address: aAddress },
    { chain: bChain, address: bAddress },
  ].toSorted((x, y) =>
    `${x.chain}|${x.address}`.localeCompare(`${y.chain}|${y.address}`),
  ) as [{ chain: string; address: string }, { chain: string; address: string }]
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
