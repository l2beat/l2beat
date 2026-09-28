import type {
  DeployedTokenAssignment,
  TokenRelationRoute,
} from '@l2beat/database'
import { expect } from 'earl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type {
  InteropTokenDeploymentView,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '../layer2s/interop/token/getInteropTokenRelationsGraph'
import {
  groupRelationInputsByToken,
  toTokenGraphTile,
} from './buildTokenGraphTiles'

const usdc = { id: 'usdc01', symbol: 'USDC', issuer: 'circle', iconUrl: null }

describe(groupRelationInputsByToken.name, () => {
  it('gives each token the relations touching its deployments', () => {
    const usdcEthereum = assignment('ethereum', '0xE1', 'usdc01')
    const usdcBase = assignment('base', '0xB1', 'usdc01')
    const usdceArbitrum = assignment('arbitrum', '0xA1', 'usdce1')
    const daiEthereum = assignment('ethereum', '0xE3', 'dai001')
    const ignored = { ...assignment('nova', '0xF1', 'usdc01'), ignored: true }
    const unassigned = assignment('optimism', '0x01', null)
    const within = route(usdcEthereum, usdcBase)
    const across = route(usdcEthereum, usdceArbitrum)
    const toIgnored = route(daiEthereum, ignored)
    const toUnassigned = route(usdcBase, unassigned)

    const inputs = groupRelationInputsByToken(
      [usdcEthereum, usdcBase, usdceArbitrum, daiEthereum, ignored, unassigned],
      [within, across, toIgnored, toUnassigned],
    )

    expect([...inputs.keys()]).toEqual(['usdc01', 'usdce1', 'dai001'])
    expect(inputs.get('usdc01')).toEqual({
      deployedTokens: [usdcEthereum, usdcBase],
      routes: [within, across, toUnassigned],
    })
    expect(inputs.get('usdce1')?.routes).toEqual([across])
    expect(inputs.get('dai001')?.routes).toEqual([toIgnored])
  })
})

describe(toTokenGraphTile.name, () => {
  const ethereumCluster = node('ethereum|0xe1', 150, [
    deployment('ethereum', 'Ethereum'),
    deployment('nova', 'Arbitrum Nova'),
  ])
  const base = node('base|0xb1', null, [deployment('base', 'Base')])
  const optimism = node('optimism|0x01', 0, [deployment('optimism', 'OP')])
  const graph: InteropTokenRelationsGraph = {
    nodes: [{ ...ethereumCluster, bridges: [bridge('cctp')] }, base, optimism],
    edges: [
      {
        backer: ethereumCluster.id,
        backed: base.id,
        bridges: [bridge('cctp'), bridge('base')],
      },
    ],
  }

  it('shows the graph as the full view does by default', () => {
    const tile = toTokenGraphTile(usdc, graph, { volume: 500, linkable: true })

    expect(tile).toEqual({
      id: usdc.id,
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: TOKEN_PLACEHOLDER_ICON_URL,
      href: '/interop/tokens/usdc01/circle/usdc',
      volume: 500,
      deploymentsCount: 3,
      chainsCount: 3,
      bridgesCount: 2,
      graph: {
        nodes: [
          {
            id: ethereumCluster.id,
            volume: 150,
            chains: [
              { id: 'nova', iconUrl: 'nova.png' },
              { id: 'ethereum', iconUrl: 'ethereum.png' },
            ],
          },
          {
            id: base.id,
            volume: null,
            chains: [{ id: 'base', iconUrl: 'base.png' }],
          },
        ],
        edges: [{ backer: ethereumCluster.id, backed: base.id }],
      },
    })
  })

  it('links only tokens with a page', () => {
    const tile = toTokenGraphTile(usdc, graph, {
      volume: null,
      linkable: false,
    })

    expect(tile?.href).toEqual(undefined)
  })

  it('leaves out tokens without a relation', () => {
    const tile = toTokenGraphTile(
      usdc,
      { nodes: [base, optimism], edges: [] },
      { volume: 500, linkable: true },
    )

    expect(tile).toEqual(undefined)
  })
})

function assignment(
  chain: string,
  address: string,
  abstractTokenId: string | null,
): DeployedTokenAssignment {
  return { chain, address, symbol: 'USDC', abstractTokenId, ignored: false }
}

function route(
  a: DeployedTokenAssignment,
  b: DeployedTokenAssignment,
): TokenRelationRoute {
  return {
    tokenAChain: a.chain,
    tokenAAddress: a.address.toLowerCase(),
    tokenBChain: b.chain,
    tokenBAddress: b.address.toLowerCase(),
    plugin: 'cctp-v2',
    bridgeType: 'burnAndMint',
    lockedToken: null,
  }
}

function node(
  id: string,
  volume: number | null,
  deployments: InteropTokenDeploymentView[],
): InteropTokenRelationsNode {
  return {
    id,
    volume,
    transferCount: null,
    avgDuration: null,
    deployments,
    bridges: [],
  }
}

function deployment(chain: string, name: string): InteropTokenDeploymentView {
  return {
    chain: { id: chain, name, iconUrl: `${chain}.png` },
    address: '0x',
    symbol: 'USDC',
    explorerUrl: undefined,
    minters: [],
    isSupported: true,
    volume: null,
    transferCount: null,
    avgDuration: null,
  }
}

function bridge(id: string) {
  return { id, name: id, iconUrl: `${id}.png`, href: `/${id}` }
}
