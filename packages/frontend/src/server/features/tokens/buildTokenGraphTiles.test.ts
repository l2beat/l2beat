import type { Project } from '@l2beat/config'
import {
  normalizeTokenRelation,
  type TokenRelationRoute,
} from '@l2beat/database'
import { expect } from 'earl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { InteropProjectResolver } from '../layer2s/interop/utils/createInteropProjectResolver'
import { buildTokenGraphTiles } from './buildTokenGraphTiles'

const usdc = { id: 'usdc01', symbol: 'USDC', issuer: 'circle', iconUrl: null }
const usdt = {
  id: 'usdt01',
  symbol: 'USDT',
  issuer: 'tether',
  iconUrl: 'https://icons/usdt.png',
}
const dai = { id: 'dai001', symbol: 'DAI', issuer: null, iconUrl: null }

const usdcEthereum = deployment('ethereum', '0xE1', usdc.id)
const usdcArbitrum = deployment('arbitrum', '0xA1', usdc.id)
const usdcBase = deployment('base', '0xB1', usdc.id)
const usdcOptimism = deployment('optimism', '0x01', usdc.id)
const usdtEthereum = deployment('ethereum', '0xE2', usdt.id)
const usdtArbitrum = deployment('arbitrum', '0xA2', usdt.id)
const daiEthereum = deployment('ethereum', '0xE3', dai.id)

const chainInfo = new Map([
  ['ethereum', { name: 'Ethereum', iconUrl: 'eth.png' }],
  ['arbitrum', { name: 'Arbitrum One', iconUrl: 'arb.png' }],
  ['base', { name: 'Base', iconUrl: undefined }],
])

const noProjects: InteropProjectResolver = () => []

describe(buildTokenGraphTiles.name, () => {
  it('draws only tokens with a relation, busiest first', () => {
    const tiles = buildTokenGraphTiles({
      tokens: [dai, usdc, usdt],
      deployments: [
        usdcEthereum,
        usdcArbitrum,
        usdtEthereum,
        usdtArbitrum,
        daiEthereum,
      ],
      routes: [
        route(usdcEthereum, usdcArbitrum, 'orbitstack', 'lockAndMint', 'A'),
        route(usdtEthereum, usdtArbitrum, 'cctp-v2', 'burnAndMint'),
      ],
      volumeByTokenId: new Map([[usdt.id, 500]]),
      chainInfo,
      resolveProjects: noProjects,
    })

    expect(tiles.map((tile) => tile.id)).toEqual([usdt.id, usdc.id])
    expect(tiles[0]?.volume).toEqual(500)
    expect(tiles[1]?.volume).toEqual(null)
  })

  it('describes the token and its related deployments', () => {
    const [tile] = buildTokenGraphTiles({
      tokens: [usdc],
      deployments: [usdcEthereum, usdcArbitrum, usdcBase, usdcOptimism],
      routes: [
        route(usdcEthereum, usdcArbitrum, 'cctp-v2', 'burnAndMint'),
        route(usdcEthereum, usdcBase, 'opstack', 'lockAndMint', 'A'),
      ],
      volumeByTokenId: new Map(),
      chainInfo,
      resolveProjects: noProjects,
    })

    expect(tile).toEqual({
      id: usdc.id,
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: TOKEN_PLACEHOLDER_ICON_URL,
      href: '/interop/tokens/usdc01/circle/usdc',
      volume: null,
      // Optimism has no relation, so it is not counted.
      deploymentsCount: 3,
      chainsCount: 3,
      bridgesCount: 0,
      graph: {
        nodes: [
          {
            id: 'arbitrum|0xa1',
            // Chains are sorted by display name; unknown chains keep their id.
            chains: [
              { id: 'arbitrum', iconUrl: 'arb.png' },
              { id: 'ethereum', iconUrl: 'eth.png' },
            ],
          },
          { id: 'base|0xb1', chains: [{ id: 'base', iconUrl: undefined }] },
        ],
        edges: [{ from: 'arbitrum|0xa1', to: 'base|0xb1' }],
      },
    })
  })

  it('counts the distinct projects behind the relations', () => {
    const resolveProjects: InteropProjectResolver = ({ plugin }) =>
      plugin === 'cctp-v2'
        ? [project('cctp'), project('circle')]
        : [project('cctp')]
    const [tile] = buildTokenGraphTiles({
      tokens: [usdc],
      deployments: [usdcEthereum, usdcArbitrum, usdcBase],
      routes: [
        route(usdcEthereum, usdcArbitrum, 'cctp-v2', 'burnAndMint'),
        route(usdcEthereum, usdcBase, 'cctp-v1', 'lockAndMint', 'A'),
      ],
      volumeByTokenId: new Map(),
      chainInfo,
      resolveProjects,
    })

    expect(tile?.bridgesCount).toEqual(2)
  })

  it('ignores relations reaching into another token', () => {
    const tiles = buildTokenGraphTiles({
      tokens: [usdc, usdt],
      deployments: [usdcEthereum, usdtArbitrum],
      routes: [
        route(usdcEthereum, usdtArbitrum, 'opstack', 'lockAndMint', 'A'),
      ],
      volumeByTokenId: new Map(),
      chainInfo,
      resolveProjects: noProjects,
    })

    expect(tiles).toEqual([])
  })
})

function deployment(chain: string, address: string, abstractTokenId: string) {
  return { chain, address, abstractTokenId }
}

function route(
  a: { chain: string; address: string },
  b: { chain: string; address: string },
  plugin: string,
  bridgeType: TokenRelationRoute['bridgeType'],
  lockedToken: TokenRelationRoute['lockedToken'] = null,
): TokenRelationRoute {
  return normalizeTokenRelation({
    tokenAChain: a.chain,
    tokenAAddress: a.address,
    tokenBChain: b.chain,
    tokenBAddress: b.address,
    plugin,
    bridgeType,
    lockedToken,
  })
}

function project(id: string): Project<'interopConfig'> {
  return { id } as unknown as Project<'interopConfig'>
}
