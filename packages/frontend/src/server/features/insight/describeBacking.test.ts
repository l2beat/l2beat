import type { TokenRelationRoute } from '@l2beat/database'
import { expect } from 'earl'
import {
  type BridgeObservation,
  describeBacking,
  groupRoutesByDeployment,
  toDeploymentKey,
} from './describeBacking'

// Methodology: one Ethereum deployment against routes covering every role,
// with resolvers that echo their input, so each assertion shows which side
// the function read as locked and which chain pair it resolved bridges for.
describe(describeBacking.name, () => {
  const ethereumToken = { chain: 'ethereum', address: `0x${'1'.repeat(40)}` }
  const solanaToken = { chain: 'solana', address: 'So1ana' }
  const suiToken = { chain: 'sui', address: '0xsui' }
  const arbitrumToken = { chain: 'arbitrum', address: `0x${'2'.repeat(40)}` }
  const baseToken = { chain: 'base', address: `0x${'3'.repeat(40)}` }

  const observations: BridgeObservation[] = []
  const resolveBridges = (observation: BridgeObservation) => {
    observations.push(observation)
    return [{ id: observation.plugin, name: observation.plugin, iconUrl: '' }]
  }
  const resolveChain = (id: string) => ({ id, name: id, iconUrl: undefined })

  beforeEach(() => {
    observations.length = 0
  })

  it('groups minted-against routes by plugin, one chain per locked side', () => {
    const backing = describeBacking(
      ethereumToken,
      [
        route(solanaToken, ethereumToken, 'wormhole', 'lockAndMint', 'A'),
        // Ethereum on the A side, locked on B: still minted on Ethereum.
        route(ethereumToken, suiToken, 'wormhole', 'lockAndMint', 'B'),
      ],
      resolveBridges,
      resolveChain,
    )

    expect(backing.mintedAgainst).toEqual([
      {
        plugin: 'wormhole',
        bridges: [{ id: 'wormhole', name: 'wormhole', iconUrl: '' }],
        chains: [resolveChain('solana'), resolveChain('sui')],
      },
    ])
    expect(backing.lockedFor).toEqual([])
    expect(observations).toEqual([
      {
        plugin: 'wormhole',
        bridgeType: 'lockAndMint',
        srcChain: 'solana',
        dstChain: 'ethereum',
      },
      {
        plugin: 'wormhole',
        bridgeType: 'lockAndMint',
        srcChain: 'sui',
        dstChain: 'ethereum',
      },
    ])
  })

  it('separates locked, burn-and-mint and unknown-role routes', () => {
    const backing = describeBacking(
      ethereumToken,
      [
        route(ethereumToken, arbitrumToken, 'orbitstack', 'lockAndMint', 'A'),
        route(ethereumToken, baseToken, 'cctp-v2', 'burnAndMint', null),
        route(ethereumToken, suiToken, 'mystery', 'lockAndMint', null),
        route(ethereumToken, solanaToken, 'swap', 'nonMinting', null),
      ],
      resolveBridges,
      resolveChain,
    )

    expect(backing.mintedAgainst).toEqual([])
    expect(backing.lockedFor.map((group) => group.chains)).toEqual([
      [resolveChain('arbitrum')],
    ])
    expect(backing.burnAndMint.map((group) => group.plugin)).toEqual([
      'cctp-v2',
    ])
    expect(backing.unknownRole.map((group) => group.plugin)).toEqual([
      'mystery',
    ])
    // A locked deployment is the source: value leaves Ethereum.
    expect(
      observations.find((observation) => observation.plugin === 'orbitstack'),
    ).toEqual({
      plugin: 'orbitstack',
      bridgeType: 'lockAndMint',
      srcChain: 'ethereum',
      dstChain: 'arbitrum',
    })
  })

  it('ignores routes that do not mention the deployment', () => {
    const backing = describeBacking(
      ethereumToken,
      [route(arbitrumToken, baseToken, 'opstack', 'burnAndMint', null)],
      resolveBridges,
      resolveChain,
    )

    expect(backing).toEqual({
      mintedAgainst: [],
      burnAndMint: [],
      lockedFor: [],
      unknownRole: [],
    })
  })

  it('merges the bridges every route of a group resolves to', () => {
    const backing = describeBacking(
      ethereumToken,
      [
        route(solanaToken, ethereumToken, 'wormhole', 'lockAndMint', 'A'),
        route(suiToken, ethereumToken, 'wormhole', 'lockAndMint', 'A'),
      ],
      (observation) => [
        { id: 'wormhole', name: 'Wormhole', iconUrl: '' },
        ...(observation.srcChain === 'sui'
          ? [{ id: 'portal', name: 'Portal', iconUrl: '' }]
          : []),
      ],
      resolveChain,
    )

    expect(
      backing.mintedAgainst[0]?.bridges.map((bridge) => bridge.id),
    ).toEqual(['wormhole', 'portal'])
  })
})

// Methodology: routes sharing endpoints, one with a checksummed address and
// one joining a deployment to itself, so the lookup a report makes per
// holding is checked to find each of its routes exactly once.
describe(groupRoutesByDeployment.name, () => {
  const ethereumToken = { chain: 'ethereum', address: `0x${'a'.repeat(40)}` }
  const arbitrumToken = { chain: 'arbitrum', address: `0x${'b'.repeat(40)}` }
  const baseToken = { chain: 'base', address: `0x${'c'.repeat(40)}` }

  it('lists each route under both endpoints, once each', () => {
    const toArbitrum = route(
      { ...ethereumToken, address: ethereumToken.address.toUpperCase() },
      arbitrumToken,
      'canonical',
      'lockAndMint',
      'A',
    )
    const toBase = route(
      baseToken,
      ethereumToken,
      'wormhole',
      'burnAndMint',
      null,
    )
    const toItself = route(baseToken, baseToken, 'odd', 'burnAndMint', null)

    const byDeployment = groupRoutesByDeployment([toArbitrum, toBase, toItself])
    const routesOf = (token: { chain: string; address: string }) =>
      byDeployment.get(toDeploymentKey(token.chain, token.address))

    expect(routesOf(ethereumToken)).toEqual([toArbitrum, toBase])
    expect(routesOf(arbitrumToken)).toEqual([toArbitrum])
    expect(routesOf(baseToken)).toEqual([toBase, toItself])
    expect(byDeployment.size).toEqual(3)
  })
})

function route(
  a: { chain: string; address: string },
  b: { chain: string; address: string },
  plugin: string,
  bridgeType: TokenRelationRoute['bridgeType'],
  lockedToken: TokenRelationRoute['lockedToken'],
): TokenRelationRoute {
  return {
    tokenAChain: a.chain,
    tokenAAddress: a.address,
    tokenBChain: b.chain,
    tokenBAddress: b.address,
    plugin,
    bridgeType,
    lockedToken,
  }
}
