import type { InteropPlugin, Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  createMintingProjectResolver,
  type MintingProjectInput,
} from './createMintingProjectResolver'

describe(createMintingProjectResolver.name, () => {
  it('matches projects using configurations that can mint', () => {
    const resolve = createMintingProjectResolver([
      project({
        id: 'meson',
        plugins: [{ plugin: 'meson', bridgeType: 'nonMinting' }],
      }),
      project({
        id: 'freetunnel',
        plugins: [{ plugin: 'meson', bridgeType: 'burnAndMint' }],
      }),
    ])

    expect(resolve(minting({ plugin: 'meson' })).map((p) => p.id)).toEqual([
      ProjectId('freetunnel'),
    ])
  })

  it('uses the deployment chain to disambiguate shared plugins', () => {
    const resolve = createMintingProjectResolver([
      project({
        id: 'base',
        plugins: [
          { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'base' },
        ],
      }),
      project({
        id: 'optimism',
        plugins: [
          {
            plugin: 'opstack',
            bridgeType: 'lockAndMint',
            chain: 'optimism',
          },
        ],
      }),
    ])

    expect(resolve(minting()).map((p) => p.id)).toEqual([ProjectId('base')])
  })

  it('honors abstract token qualifiers', () => {
    const resolve = createMintingProjectResolver([
      project({
        id: 'usdc-bridge',
        plugins: [
          {
            plugin: 'ccip',
            bridgeType: 'burnAndMint',
            abstractTokenId: 'circle-usdc',
          },
        ],
      }),
      project({
        id: 'eth-bridge',
        plugins: [
          {
            plugin: 'ccip',
            bridgeType: 'burnAndMint',
            abstractTokenId: 'ethereum-eth',
          },
        ],
      }),
    ])

    expect(resolve(minting({ plugin: 'ccip' })).map((p) => p.id)).toEqual([
      ProjectId('usdc-bridge'),
    ])
  })

  it('ignores transfer type because relations do not carry it', () => {
    const resolve = createMintingProjectResolver([
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

    expect(resolve(minting({ plugin: 'axelar' })).map((p) => p.id)).toEqual([
      ProjectId('axelar'),
    ])
  })

  it('prefers a matching subgroup over its parent', () => {
    const plugins: InteropPlugin[] = [
      { plugin: 'layerzero-v2-ofts', bridgeType: 'burnAndMint' },
    ]
    const resolve = createMintingProjectResolver([
      project({ id: 'layerzero', plugins }),
      project({ id: 'usdt0', plugins, subgroupId: 'layerzero' }),
    ])

    expect(
      resolve(minting({ plugin: 'layerzero-v2-ofts' })).map((p) => p.id),
    ).toEqual([ProjectId('usdt0')])
  })

  it('returns every surviving match', () => {
    const resolve = createMintingProjectResolver([
      project({
        id: 'second',
        interopName: 'Zeta',
        plugins: [{ plugin: 'ccip', bridgeType: 'burnAndMint' }],
      }),
      project({
        id: 'first',
        interopName: 'Alpha',
        plugins: [{ plugin: 'ccip', bridgeType: 'burnAndMint' }],
      }),
    ])

    expect(
      resolve(minting({ plugin: 'ccip' })).map((p) => p.id),
    ).toEqualUnsorted([ProjectId('first'), ProjectId('second')])
  })

  it('returns nothing for an unknown plugin', () => {
    const resolve = createMintingProjectResolver([
      project({
        id: 'base',
        plugins: [
          { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'base' },
        ],
      }),
    ])

    expect(resolve(minting({ plugin: 'unknown' }))).toEqual([])
  })
})

function minting(
  override: Partial<MintingProjectInput> = {},
): MintingProjectInput {
  return {
    plugin: 'opstack',
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
