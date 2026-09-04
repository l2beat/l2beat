import {
  normalizeTokenRelation,
  type TokenRelationRoute,
} from '@l2beat/database'
import { expect } from 'earl'
import { buildTokenRelationsGraph } from './buildTokenRelationsGraph'

const ethereum = { chain: 'ethereum', address: '0xE1' }
const arbitrum = { chain: 'arbitrum', address: '0xA1' }
const base = { chain: 'base', address: '0xB1' }
const optimism = { chain: 'optimism', address: '0x01' }

describe(buildTokenRelationsGraph.name, () => {
  it('collapses burn-and-mint deployments into one node named after the smallest member', () => {
    const graph = buildTokenRelationsGraph(
      [ethereum, arbitrum, base, optimism],
      [
        route(ethereum, base, 'cctp-v2', 'burnAndMint'),
        route(arbitrum, ethereum, 'cctp-v2', 'burnAndMint'),
        route(arbitrum, ethereum, 'ccip', 'burnAndMint'),
      ],
    )

    expect(graph.edges).toEqual([])
    expect(graph.nodes).toEqual([
      {
        id: 'arbitrum|0xa1',
        members: [arbitrum, base, ethereum],
        sources: [
          {
            plugin: 'cctp-v2',
            bridgeType: 'burnAndMint',
            chains: ['base', 'ethereum'],
          },
          {
            plugin: 'cctp-v2',
            bridgeType: 'burnAndMint',
            chains: ['arbitrum', 'ethereum'],
          },
          {
            plugin: 'ccip',
            bridgeType: 'burnAndMint',
            chains: ['arbitrum', 'ethereum'],
          },
        ],
      },
      { id: 'optimism|0x01', members: [optimism], sources: [] },
    ])
  })

  it('draws lock-and-mint edges from the locked side and skips intra-node or unknown-side ones', () => {
    const graph = buildTokenRelationsGraph(
      [ethereum, arbitrum, base, optimism],
      [
        route(arbitrum, ethereum, 'cctp-v2', 'burnAndMint'),
        route(arbitrum, ethereum, 'orbitstack', 'lockAndMint', ethereum),
        route(base, ethereum, 'opstack', 'lockAndMint', ethereum),
        route(base, arbitrum, 'opstack', 'lockAndMint', arbitrum),
        route(ethereum, optimism, 'opstack', 'lockAndMint'),
      ],
    )

    expect(graph.edges).toEqual([
      {
        from: 'arbitrum|0xa1',
        to: 'base|0xb1',
        sources: [
          {
            plugin: 'opstack',
            bridgeType: 'lockAndMint',
            chains: ['base', 'ethereum'],
          },
          {
            plugin: 'opstack',
            bridgeType: 'lockAndMint',
            chains: ['arbitrum', 'base'],
          },
        ],
      },
    ])
  })

  it('drops pairs claiming both directions', () => {
    const graph = buildTokenRelationsGraph(
      [ethereum, base],
      [
        route(base, ethereum, 'opstack', 'lockAndMint', ethereum),
        route(base, ethereum, 'otherbridge', 'lockAndMint', base),
      ],
    )

    expect(graph.edges).toEqual([])
  })

  it('ignores manual relations and unknown bridge types', () => {
    const graph = buildTokenRelationsGraph(
      [ethereum, arbitrum],
      [
        route(arbitrum, ethereum, 'manual', 'burnAndMint'),
        route(arbitrum, ethereum, 'somebridge', 'unknown'),
      ],
    )

    expect(graph.nodes.map((node) => node.members)).toEqual([
      [arbitrum],
      [ethereum],
    ])
  })
})

function route(
  a: { chain: string; address: string },
  b: { chain: string; address: string },
  plugin: string,
  bridgeType: TokenRelationRoute['bridgeType'],
  locked?: { chain: string; address: string },
): TokenRelationRoute {
  return normalizeTokenRelation({
    tokenAChain: a.chain,
    tokenAAddress: a.address,
    tokenBChain: b.chain,
    tokenBAddress: b.address,
    plugin,
    bridgeType,
    lockedToken: locked === undefined ? null : locked === a ? 'A' : 'B',
  })
}
