import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const wormholeNtt: BaseProject = {
  id: ProjectId('wormhole-ntt'),
  slug: 'wormhole-ntt',
  name: 'Wormhole NTT',
  shortName: 'Wormhole NTT',
  addedAt: UnixTime(1770637610),
  interopConfig: {
    showAlways: ['omnichain', 'lockAndMint'],
    plugins: [
      {
        plugin: 'wormhole-ntt',
      },
    ],
  },
  isInteropProtocol: true,
}
