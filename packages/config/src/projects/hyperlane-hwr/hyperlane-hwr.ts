import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const hyperlaneHwr: BaseProject = {
  id: ProjectId('hyperlane-hwr'),
  slug: 'hyperlane-hwr',
  name: 'Hyperlane Warp Routes',
  shortName: undefined,
  addedAt: UnixTime(1768926236),
  interopConfig: {
    showAlways: ['omnichain'],
    plugins: [
      {
        plugin: 'hyperlane-hwr',
      },
      // TODO: where should we count the AMB apps below? (messages without transfer)
      {
        plugin: 'hyperlane',
      },
      {
        plugin: 'hyperlane-simple-apps',
      },
      {
        plugin: 'hyperlane-eco',
      },
    ],
  },
  isInteropProtocol: true,
}
