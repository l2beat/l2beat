import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const hyperlaneHwr: BaseProject = {
  id: ProjectId('hyperlane-hwr'),
  slug: 'hyperlane-hwr',
  name: 'Hyperlane Warp Routes',
  shortName: undefined,
  addedAt: UnixTime(1768926236),
  interopConfig: {
    description:
      'Multichain token framework using the highly modular and open Hyperlane message bridge. Validation is custom for each token.',
    plugins: [
      {
        plugin: 'hyperlane-hwr',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'hyperlane-hwr',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'multichain',
  },
}
