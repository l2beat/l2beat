import type { Project } from '@l2beat/config'
import {
  type InteropTransferDeployedTokenPairStats,
  normalizeTokenRelation,
  type TokenRelationRoute,
} from '@l2beat/database'
import { Address32 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { InteropProjectResolver } from '../layer2s/interop/utils/createInteropProjectResolver'
import { buildTokenGraphTiles } from './buildTokenGraphTiles'

const usdc = { id: 'usdc01', symbol: 'USDC', issuer: 'circle', iconUrl: null }
const usdt = { id: 'usdt01', symbol: 'USDT', issuer: 'tether', iconUrl: null }
const dai = { id: 'dai001', symbol: 'DAI', issuer: null, iconUrl: null }

const usdcEthereum = deployment('ethereum', '0xE1', usdc.id)
const usdcArbitrum = deployment('arbitrum', '0xA1', usdc.id)
const usdcNova = deployment('nova', '0xF1', usdc.id)
const usdcBase = deployment('base', '0xB1', usdc.id)
const usdcOptimism = deployment('optimism', '0x01', usdc.id)
const usdtEthereum = deployment('ethereum', '0xE2', usdt.id)
const usdtArbitrum = deployment('arbitrum', '0xA2', usdt.id)
const daiEthereum = deployment('ethereum', '0xE3', dai.id)

const chainInfo = new Map([
  ['ethereum', { name: 'Ethereum', iconUrl: 'eth.png' }],
  ['arbitrum', { name: 'Arbitrum One', iconUrl: 'arb.png' }],
  ['nova', { name: 'Arbitrum Nova', iconUrl: 'nova.png' }],
  ['base', { name: 'Base', iconUrl: undefined }],
])

describe(buildTokenGraphTiles.name, () => {
  it('lists tokens with a relation, busiest first, linking known ones', () => {
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
      linkableTokenIds: new Set([usdt.id]),
      chainInfo,
      resolveProjects: () => [],
      activeChainIds: new Set(['ethereum', 'arbitrum']),
      pairStatsByTokenId: undefined,
    })

    expect(tiles.map((tile) => [tile.id, tile.volume, tile.href])).toEqual([
      [usdt.id, 500, '/interop/tokens/usdt01/tether/usdt'],
      [usdc.id, null, undefined],
    ])
  })

  it('describes the related deployments of a token', () => {
    const resolveProjects: InteropProjectResolver = ({ plugin }) =>
      plugin === 'cctp-v2'
        ? [project('cctp'), project('circle')]
        : [project('cctp')]
    const [tile] = buildTokenGraphTiles({
      tokens: [usdc],
      deployments: [usdcEthereum, usdcNova, usdcBase, usdcOptimism],
      routes: [
        route(usdcEthereum, usdcNova, 'cctp-v2', 'burnAndMint'),
        route(usdcEthereum, usdcBase, 'cctp-v1', 'lockAndMint', 'A'),
      ],
      volumeByTokenId: new Map(),
      linkableTokenIds: new Set([usdc.id]),
      chainInfo,
      resolveProjects,
      activeChainIds: new Set(['ethereum', 'nova']),
      pairStatsByTokenId: undefined,
    })

    expect(tile).toEqual({
      id: usdc.id,
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: TOKEN_PLACEHOLDER_ICON_URL,
      href: '/interop/tokens/usdc01/circle/usdc',
      volume: null,
      // Optimism has no relation and is left out.
      deploymentsCount: 3,
      chainsCount: 3,
      bridgesCount: 2,
      graph: {
        nodes: [
          {
            id: 'base|0xb1',
            volume: null,
            chains: [{ id: 'base', iconUrl: undefined }],
          },
          {
            id: 'ethereum|0xe1',
            volume: null,
            // Display-name order, not id order.
            chains: [
              { id: 'nova', iconUrl: 'nova.png' },
              { id: 'ethereum', iconUrl: 'eth.png' },
            ],
          },
        ],
        edges: [{ from: 'ethereum|0xe1', to: 'base|0xb1' }],
      },
    })
  })

  it('gives nodes the volume the full graph sorts by', () => {
    const ethereum = deployment('ethereum', full('e1'), usdc.id)
    const nova = deployment('nova', full('f1'), usdc.id)
    const base = deployment('base', full('b1'), usdc.id)
    const [tile] = buildTokenGraphTiles({
      tokens: [usdc],
      deployments: [ethereum, nova, base],
      routes: [
        route(ethereum, nova, 'cctp-v2', 'burnAndMint'),
        route(ethereum, base, 'cctp-v1', 'lockAndMint', 'A'),
      ],
      volumeByTokenId: new Map(),
      linkableTokenIds: new Set(),
      chainInfo,
      resolveProjects: () => [],
      activeChainIds: new Set(['ethereum', 'nova']),
      pairStatsByTokenId: new Map([
        [
          usdc.id,
          [transfer(ethereum, nova, 100), transfer(ethereum, base, 50)],
        ],
      ]),
    })

    expect(tile?.graph.nodes.map((node) => [node.id, node.volume])).toEqual([
      [`base|${full('b1')}`, null], // off the active chains
      [`ethereum|${full('e1')}`, 150], // the intra-cluster transfer counts once
    ])
  })
})

function deployment(chain: string, address: string, abstractTokenId: string) {
  return { chain, address, abstractTokenId }
}

type Endpoint = { chain: string; address: string }

function route(
  a: Endpoint,
  b: Endpoint,
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

function full(byte: string) {
  return `0x${byte.repeat(20)}`
}

function transfer(
  src: Endpoint,
  dst: Endpoint,
  volume: number,
): InteropTransferDeployedTokenPairStats {
  const side = (d: Endpoint) => ({
    chain: d.chain,
    address: Address32.from(d.address),
  })
  return {
    src: side(src),
    dst: side(dst),
    volume,
    transferCount: 1,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
  }
}

function project(id: string): Project<'interopConfig'> {
  return { id } as unknown as Project<'interopConfig'>
}
