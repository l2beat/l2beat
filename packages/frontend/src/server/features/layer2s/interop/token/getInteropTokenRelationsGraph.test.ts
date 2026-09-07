import type { InteropPlugin, Project } from '@l2beat/config'
import type { TokenRelationRoute } from '@l2beat/database'
import { Address32, assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
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
const interopProjects = [
  project('cctpv2', 'CCTP v2', [
    { plugin: 'cctp-v2', bridgeType: 'burnAndMint' },
  ]),
  project('base', 'Base Bridge', [
    { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'base' },
  ]),
  project('optimism', 'OP Bridge', [
    { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'optimism' },
  ]),
]

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
      [],
      interopProjects,
    )

    const [clusterNode, baseNode] = graph.nodes
    assert(clusterNode && baseNode)
    expect(clusterNode).toHaveSubset({
      id: 'arbitrum|0xa1',
      volume: 170,
      transferCount: 3,
      avgDuration: 20,
    })
    expect(clusterNode.deployments.map((d) => [d.chain.id, d.volume])).toEqual([
      ['ethereum', 170],
      ['arbitrum', 150],
    ])
    expect(baseNode).toHaveSubset({ volume: 20, transferCount: 1 })
  })

  it('reports null stats off supported chains and zero for supported ones the snapshot lacks', () => {
    const solana = deployment(
      'solana',
      'So11111111111111111111111111111111111111112',
    )
    solana.isSupported = false
    const graph = getInteropTokenRelationsGraph(
      usdc,
      [ethereum, base, solana],
      {
        routes: [],
        pairStats: [pair(ethereum, arbitrum, { volume: 100, duration: 10 })],
      },
      [],
      interopProjects,
    )

    expect(
      graph.nodes.map((node) => [node.id, node.volume, node.transferCount]),
    ).toEqual([
      ['base|0xb1', 0, 0],
      ['ethereum|0xe1', 100, 1],
      ['solana|so11111111111111111111111111111111111111112', null, null],
    ])
  })

  it('distinguishes an empty snapshot from a missing snapshot', () => {
    for (const pairStats of [[], undefined]) {
      const graph = getInteropTokenRelationsGraph(
        usdc,
        [ethereum],
        { routes: [], pairStats },
        [],
        interopProjects,
      )
      const expected = {
        volume: pairStats ? 0 : null,
        transferCount: pairStats ? 0 : null,
        avgDuration: null,
      }
      expect(graph.nodes[0]).toHaveSubset(expected)
      expect(graph.nodes[0]?.deployments[0]).toHaveSubset(expected)
    }
  })

  it('weights duration by measured transfers and counts one-sided pairs', () => {
    const graph = getInteropTokenRelationsGraph(
      usdc,
      [ethereum, arbitrum],
      {
        routes: [cluster],
        pairStats: [
          {
            ...pair(ethereum, arbitrum, { volume: 100, duration: 60 }),
            transferCount: 4,
            transfersWithDurationCount: 3,
          },
          {
            src: {
              chain: ethereum.chain,
              address: Address32.from(ethereum.address),
            },
            volume: 10,
            transferCount: 1,
            transfersWithDurationCount: 1,
            totalDurationSum: 20,
          },
        ],
      },
      [],
      interopProjects,
    )

    expect(graph.nodes[0]).toHaveSubset({
      volume: 110,
      transferCount: 5,
      avgDuration: 20,
    })
  })

  it('resolves bridges per node and edge, honouring chain qualifiers', () => {
    const graph = getInteropTokenRelationsGraph(
      usdc,
      [ethereum, arbitrum, base],
      { routes: [cluster, backing], pairStats: undefined },
      [],
      interopProjects,
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
      chain: { id: 'base', name: 'Base', iconUrl: '/icons/base.png' },
      address: '0xb1',
      symbol: 'USDC',
      explorerUrl: 'https://basescan.org/address/0xb1',
      minters: [],
      isSupported: true,
      volume: null,
      transferCount: null,
      avgDuration: null,
    })
  })
  it('resolves minters from minting plugins, deduplicated and sorted', () => {
    const graph = getInteropTokenRelationsGraph(
      usdc,
      [
        deployment('base', '0xb1', [
          {
            plugin: 'ccip',
            bridgeType: 'burnAndMint',
            relatedChain: 'ethereum',
          },
          {
            plugin: 'cctp-v2',
            bridgeType: 'burnAndMint',
            relatedChain: 'ethereum',
          },
          {
            plugin: 'manual',
            bridgeType: 'lockAndMint',
            relatedChain: 'ethereum',
          },
        ]),
      ],
      { routes: [], pairStats: undefined },
      [],
      [
        project('zeta', 'Zeta bridge', [
          { plugin: 'cctp-v2', bridgeType: 'burnAndMint' },
        ]),
        project('alpha', 'Alpha bridge', [
          { plugin: 'ccip', bridgeType: 'burnAndMint' },
          { plugin: 'cctp-v2', bridgeType: 'burnAndMint' },
        ]),
      ],
    )

    expect(graph.nodes[0]?.deployments[0]?.minters.map((m) => m.name)).toEqual([
      'Alpha bridge',
      'Zeta bridge',
    ])
  })

  it('falls back to project metadata and keeps unknown chains identifiable', () => {
    const chainProject: Project<'chainConfig'> = {
      id: ProjectId('custom-project'),
      slug: 'custom-project',
      name: 'Custom Chain',
      shortName: undefined,
      addedAt: UnixTime(0),
      chainConfig: {
        name: 'custom-chain',
        chainId: 1234,
        explorerUrl: 'https://explorer.example',
        apis: [],
      },
    }
    const graph = getInteropTokenRelationsGraph(
      usdc,
      [
        deployment('custom-chain', '0xfa'),
        deployment('custom-chain', 'native:token'),
        deployment('unknown-chain', '0xfb'),
      ],
      { routes: [], pairStats: undefined },
      [chainProject],
      interopProjects,
    )

    const deployments = graph.nodes.flatMap((node) => node.deployments)
    expect(deployments[0]).toHaveSubset({
      chain: {
        id: 'custom-chain',
        name: 'Custom Chain',
        iconUrl: '/icons/custom-project.png',
      },
      explorerUrl: 'https://explorer.example/address/0xfa',
    })
    expect(deployments[1]?.explorerUrl).toEqual(undefined)
    expect(deployments[2]).toHaveSubset({
      chain: { id: 'unknown-chain', name: 'unknown-chain', iconUrl: undefined },
      explorerUrl: undefined,
    })
  })
})

function deployment(
  chain: string,
  address: string,
  mintingPlugins: InteropTokenOnchainDeployment['mintingPlugins'] = [],
): InteropTokenOnchainDeployment {
  return { chain, address, symbol: 'USDC', mintingPlugins, isSupported: true }
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
