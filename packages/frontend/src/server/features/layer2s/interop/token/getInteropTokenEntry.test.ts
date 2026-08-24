import type { InteropPlugin, Project } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getInteropTokenEntry } from './getInteropTokenEntry'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'

describe(getInteropTokenEntry.name, () => {
  it('maps minting plugins to deduplicated project summaries', () => {
    const entry = getInteropTokenEntry(
      'circle-usdc',
      [],
      [],
      [
        project({
          id: 'zeta',
          interopName: 'Zeta bridge',
          plugins: [{ plugin: 'cctp-v2', bridgeType: 'burnAndMint' }],
        }),
        project({
          id: 'alpha',
          interopName: 'Alpha bridge',
          plugins: [
            { plugin: 'ccip', bridgeType: 'burnAndMint' },
            { plugin: 'cctp-v2', bridgeType: 'burnAndMint' },
          ],
        }),
      ],
      [
        deployment({
          mintingPlugins: [
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
          ],
        }),
      ],
    )

    const section = entry.sections.find(
      (section) => section.type === 'InteropTokenOnchainDeploymentsSection',
    )
    assert(section?.type === 'InteropTokenOnchainDeploymentsSection')

    const minters = section.props.deployments[0]?.minters
    assert(minters)
    expect(minters).toEqual([
      {
        id: ProjectId('alpha'),
        name: 'Alpha bridge',
        iconUrl: '/icons/alpha.png',
        href: '/interop/protocols/alpha',
      },
      {
        id: ProjectId('zeta'),
        name: 'Zeta bridge',
        iconUrl: '/icons/zeta.png',
        href: '/interop/protocols/zeta',
      },
    ])
  })
})

function deployment(
  override: Partial<InteropTokenOnchainDeployment> = {},
): InteropTokenOnchainDeployment {
  return {
    chain: 'base',
    address: '0x1234',
    symbol: 'USDC',
    mintingPlugins: [],
    isSupported: true,
    volume: 100,
    transferCount: 2,
    avgDuration: 10,
    ...override,
  }
}

function project({
  id,
  interopName,
  plugins,
}: {
  id: string
  interopName: string
  plugins: InteropPlugin[]
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug: id,
    name: id,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig: {
      name: interopName,
      plugins,
      type: 'multichain',
    },
  }
}
