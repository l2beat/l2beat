import type { InteropPlugin, Project } from '@l2beat/config'
import type { TokenRelationRoute } from '@l2beat/database'
import { Address32, assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createInteropProjectResolver } from '../utils/createInteropProjectResolver'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'
import { getInteropTokenRelationsGraph } from './getInteropTokenRelationsGraph'

const usdc = 'circle-usdc'
const ethereum = deployment('ethereum', '0xe1')
const arbitrum = deployment('arbitrum', '0xa1')
const base = deployment('base', '0xb1')
const cluster: TokenRelationRoute = {
  tokenAChain: 'arbitrum',
  tokenAAddress: '0xa1',
  tokenBChain: 'ethereum',
  tokenBAddress: '0xe1',
  plugin: 'cctp-v2',
  bridgeType: 'burnAndMint',
  lockedToken: null,
}
const backing: TokenRelationRoute = {
  tokenAChain: 'base',
  tokenAAddress: '0xb1',
  tokenBChain: 'ethereum',
  tokenBAddress: '0xe1',
  plugin: 'opstack',
  bridgeType: 'lockAndMint',
  lockedToken: 'B',
}
const resolveProjects = createInteropProjectResolver([
  project('cctpv2', 'CCTP v2', [
    { plugin: 'cctp-v2', bridgeType: 'burnAndMint' },
  ]),
  project('base', 'Base Bridge', [
    { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'base' },
  ]),
  project('optimism', 'OP Bridge', [
    { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'optimism' },
  ]),
])

describe(getInteropTokenRelationsGraph.name, () => {
  it('counts a transfer once per node and once per deployment it touches', () => {
    const graph = getInteropTokenRelationsGraph(
      usdc,
      [ethereum, arbitrum, base],
      {
        routes: [cluster, backing],
        pairStats: [
          pair(ethereum, arbitrum, { volume: 100, duration: 10 }),
          pair(arbitrum, ethereum, { volume: 50, duration: 30 }),
          pair(ethereum, base, { volume: 20, duration: 20 }),
        ],
      },
      new Map(),
      resolveProjects,
    )

    const [clusterNode, baseNode] = graph.nodes
    assert(clusterNode && baseNode)
    expect(clusterNode).toHaveSubset({
      id: 'arbitrum|0xa1',
      volume: 170,
      transferCount: 3,
      avgDuration: 20,
    })
    expect(
      clusterNode.deployments.map((d) => [d.chain.name, d.volume]),
    ).toEqual([
      ['ethereum', 170],
      ['arbitrum', 150],
    ])
    expect(baseNode).toHaveSubset({ volume: 20, transferCount: 1 })
  })

  it('resolves bridges per node and edge, honouring chain qualifiers', () => {
    const graph = getInteropTokenRelationsGraph(
      usdc,
      [ethereum, arbitrum, base],
      { routes: [cluster, backing], pairStats: undefined },
      new Map([
        ['base', { name: 'Base', explorerUrl: 'https://basescan.org' }],
      ]),
      resolveProjects,
    )

    expect(graph.nodes.map((node) => node.bridges.map((b) => b.name))).toEqual([
      ['CCTP v2'],
      [],
    ])
    expect(graph.edges).toEqual([
      {
        from: 'arbitrum|0xa1',
        to: 'base|0xb1',
        bridges: [
          {
            id: ProjectId('base'),
            name: 'Base Bridge',
            iconUrl: '/icons/base.png',
            href: '/interop/protocols/base',
          },
        ],
      },
    ])
    expect(graph.nodes[1]?.deployments[0]).toEqual({
      chain: { id: 'base', name: 'Base', iconUrl: undefined },
      address: '0xb1',
      symbol: 'USDC',
      explorerUrl: 'https://basescan.org/address/0xb1',
      volume: null,
      transferCount: null,
      avgDuration: null,
    })
  })
})

function deployment(
  chain: string,
  address: string,
): InteropTokenOnchainDeployment {
  return {
    chain,
    address,
    symbol: 'USDC',
    mintingPlugins: [],
    isSupported: true,
  }
}

function pair(
  src: InteropTokenOnchainDeployment,
  dst: InteropTokenOnchainDeployment,
  stats: { volume: number; duration: number },
) {
  return {
    src: { chain: src.chain, address: Address32.from(src.address) },
    dst: { chain: dst.chain, address: Address32.from(dst.address) },
    transferCount: 1,
    transfersWithDurationCount: 1,
    totalDurationSum: stats.duration,
    volume: stats.volume,
  }
}

function project(
  id: string,
  name: string,
  plugins: InteropPlugin[],
): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug: id,
    name: id,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig: { name, plugins, type: 'multichain' },
  }
}
