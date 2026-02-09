import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const wormholeWtt: BaseProject = {
  id: ProjectId('wormhole-wtt'),
  slug: 'wormhole-wtt',
  name: 'Wormhole WTT',
  shortName: 'Wormhole WTT',
  addedAt: UnixTime(1770637610),
  interopConfig: {
    showAlways: ['lockAndMint'],
    plugins: [
      {
        plugin: 'wormhole-token-bridge',
      },
    ],
  },
  isInteropProtocol: true,
}
