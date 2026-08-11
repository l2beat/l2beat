import type { InteropPlugin, Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  createMintingBridgeResolver,
  type MintingBridgeInput,
} from './createMintingBridgeResolver'

describe(createMintingBridgeResolver.name, () => {
  it('matches on plugin and bridge type', () => {
    const resolve = createMintingBridgeResolver([
      project({
        id: 'relay',
        plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
      }),
      project({
        id: 'cctp',
        plugins: [{ plugin: 'cctp-v2', bridgeType: 'burnAndMint' }],
      }),
    ])

    expect(
      resolve(minting({ plugin: 'cctp-v2', bridgeType: 'burnAndMint' })).map(
        (p) => p.id,
      ),
    ).toEqual([ProjectId('cctp')])
  })

  it('does not match a plugin configured with a different bridge type', () => {
    const resolve = createMintingBridgeResolver([
      project({
        id: 'cctp',
        plugins: [{ plugin: 'cctp-v2', bridgeType: 'lockAndMint' }],
      }),
    ])

    expect(
      resolve(minting({ plugin: 'cctp-v2', bridgeType: 'burnAndMint' })),
    ).toEqual([])
  })

  it('narrows by chain and abstract token when the config sets them', () => {
    const resolve = createMintingBridgeResolver([
      project({
        id: 'base',
        plugins: [
          { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'base' },
        ],
      }),
      project({
        id: 'optimism',
        plugins: [
          { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'optimism' },
        ],
      }),
      project({
        id: 'usdt0',
        plugins: [
          {
            plugin: 'opstack',
            bridgeType: 'lockAndMint',
            abstractTokenId: 'tether-usdt',
          },
        ],
      }),
    ])

    expect(
      resolve(
        minting({
          plugin: 'opstack',
          bridgeType: 'lockAndMint',
          chain: 'base',
          abstractTokenId: 'circle-usdc',
        }),
      ).map((p) => p.id),
    ).toEqual([ProjectId('base')])
  })

  it('ignores transferType, which a relation cannot carry', () => {
    const resolve = createMintingBridgeResolver([
      project({
        id: 'axelar',
        plugins: [
          {
            plugin: 'axelar',
            bridgeType: 'burnAndMint',
            transferType: 'axelar.Transfer',
          },
        ],
      }),
    ])

    expect(
      resolve(minting({ plugin: 'axelar', bridgeType: 'burnAndMint' })).map(
        (p) => p.id,
      ),
    ).toEqual([ProjectId('axelar')])
  })

  it('uses the subgroup when both it and its parent match', () => {
    const resolve = createMintingBridgeResolver([
      project({
        id: 'layerzero',
        plugins: [{ plugin: 'layerzero-v2-ofts', bridgeType: 'burnAndMint' }],
      }),
      project({
        id: 'usdt0',
        subgroupId: 'layerzero',
        plugins: [{ plugin: 'layerzero-v2-ofts', bridgeType: 'burnAndMint' }],
      }),
    ])

    expect(
      resolve(
        minting({
          plugin: 'layerzero-v2-ofts',
          bridgeType: 'burnAndMint',
        }),
      ).map((p) => p.id),
    ).toEqual([ProjectId('usdt0')])
  })

  it('returns every surviving match, sorted by display name', () => {
    const resolve = createMintingBridgeResolver([
      project({
        id: 'second',
        interopName: 'Zeta',
        plugins: [{ plugin: 'across', bridgeType: 'burnAndMint' }],
      }),
      project({
        id: 'first',
        interopName: 'Alpha',
        plugins: [{ plugin: 'across', bridgeType: 'burnAndMint' }],
      }),
    ])

    expect(
      resolve(minting({ plugin: 'across', bridgeType: 'burnAndMint' })).map(
        (p) => p.id,
      ),
    ).toEqual([ProjectId('first'), ProjectId('second')])
  })

  it('returns nothing for a plugin no project claims', () => {
    const resolve = createMintingBridgeResolver([
      project({
        id: 'relay',
        plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
      }),
    ])

    expect(
      resolve(minting({ plugin: 'across', bridgeType: 'burnAndMint' })),
    ).toEqual([])
  })
})

function minting(
  override: Partial<MintingBridgeInput> = {},
): MintingBridgeInput {
  return {
    plugin: 'across',
    bridgeType: 'burnAndMint',
    chain: 'base',
    abstractTokenId: 'circle-usdc',
    ...override,
  }
}

function project({
  id,
  name = id,
  interopName,
  plugins,
  subgroupId,
}: {
  id: string
  name?: string
  interopName?: string
  plugins: InteropPlugin[]
  subgroupId?: string
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug: id,
    name,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig: {
      name: interopName,
      plugins,
      type: 'multichain',
      subgroupId: subgroupId ? ProjectId(subgroupId) : undefined,
    },
  }
}
