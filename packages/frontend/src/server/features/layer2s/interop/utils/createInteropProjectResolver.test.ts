import type { InteropPlugin, Project } from '@l2beat/config'
import type { InteropPluginObservation } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createInteropProjectResolver } from './createInteropProjectResolver'

describe(createInteropProjectResolver.name, () => {
  it('prefers a matching subgroup over its parent', () => {
    const plugins: InteropPlugin[] = [
      { plugin: 'layerzero-v2-ofts', bridgeType: 'burnAndMint' },
    ]
    const resolve = createInteropProjectResolver([
      project({ id: 'layerzero', plugins }),
      project({ id: 'usdt0', plugins, subgroupId: 'layerzero' }),
    ])

    expect(
      resolve(
        observation({
          plugin: 'layerzero-v2-ofts',
          bridgeType: 'burnAndMint',
        }),
      ).map((p) => p.id),
    ).toEqual([ProjectId('usdt0')])
  })

  it('returns every surviving match', () => {
    const resolve = createInteropProjectResolver([
      project({
        id: 'second',
        plugins: [{ plugin: 'ccip', bridgeType: 'burnAndMint' }],
      }),
      project({
        id: 'first',
        plugins: [{ plugin: 'ccip', bridgeType: 'burnAndMint' }],
      }),
    ])

    expect(
      resolve(observation({ plugin: 'ccip', bridgeType: 'burnAndMint' })).map(
        (p) => p.id,
      ),
    ).toEqualUnsorted([ProjectId('first'), ProjectId('second')])
  })

  it('returns nothing for an unknown plugin', () => {
    const resolve = createInteropProjectResolver([
      project({
        id: 'base',
        plugins: [{ plugin: 'opstack', bridgeType: 'lockAndMint' }],
      }),
    ])

    expect(resolve(observation({ plugin: 'unknown' }))).toEqual([])
  })
})

function observation(
  override: Partial<InteropPluginObservation> = {},
): InteropPluginObservation {
  return {
    plugin: 'opstack',
    bridgeType: 'lockAndMint',
    srcChain: 'ethereum',
    dstChain: 'base',
    srcAbstractTokenId: 'circle-usdc',
    dstAbstractTokenId: 'circle-usdc',
    ...override,
  }
}

function project({
  id,
  plugins,
  subgroupId,
}: {
  id: string
  plugins: InteropPlugin[]
  subgroupId?: string
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug: id,
    name: id,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig: {
      plugins,
      type: 'multichain',
      subgroupId: subgroupId ? ProjectId(subgroupId) : undefined,
    },
  }
}
