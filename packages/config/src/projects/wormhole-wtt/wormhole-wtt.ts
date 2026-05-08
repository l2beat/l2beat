import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'
import { WORMHOLE_DETAILED_DESCRIPTION } from '../wormhole/shared'

export const wormholeWtt: BaseProject = {
  id: ProjectId('wormhole-wtt'),
  slug: 'wormhole-wtt',
  name: 'Wormhole WTT',
  shortName: 'Wormhole WTT',
  addedAt: UnixTime(1770637610),
  interopConfig: {
    description:
      'Minting token bridge built on top of the Wormhole message protocol.',
    detailedDescription: WORMHOLE_DETAILED_DESCRIPTION,

    plugins: [
      {
        plugin: 'wormhole-token-bridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'other',
  },
}
