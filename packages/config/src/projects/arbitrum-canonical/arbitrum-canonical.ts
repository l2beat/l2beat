import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const arbitrumCanonical: BaseProject = {
  id: ProjectId('arbitrum-canonical'),
  slug: 'arbitrum-canonical',
  name: 'Arbitrum Canonical',
  shortName: undefined,
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  interopConfig: {
    name: 'Arbitrum Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: ['orbitstack.L1ToL2Transfer'],
        },
        {
          label: 'L2 -> L1',
          transferTypes: ['orbitstack.L2ToL1Transfer'],
        },
      ],
    },
    plugins: [
      {
        chain: 'arbitrum',
        plugin: 'orbitstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'arbitrum',
        plugin: 'orbitstack-standardgateway',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'arbitrum',
        plugin: 'orbitstack-wethgateway',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'arbitrum',
        plugin: 'orbitstack-customgateway',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
