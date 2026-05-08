import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'
import { WORMHOLE_DETAILED_DESCRIPTION } from '../wormhole/shared'

export const wormholeNtt: BaseProject = {
  id: ProjectId('wormhole-ntt'),
  slug: 'wormhole-ntt',
  name: 'Wormhole NTT',
  shortName: 'Wormhole NTT',
  addedAt: UnixTime(1770637610),
  interopConfig: {
    description:
      'Multichain token framework using the Wormhole message bridge.',
    detailedDescription: WORMHOLE_DETAILED_DESCRIPTION,
    plugins: [
      {
        plugin: 'wormhole-ntt',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'wormhole-ntt',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'multichain',
  },
}
