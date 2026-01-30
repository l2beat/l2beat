import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const zkstack: BaseProject = {
  id: ProjectId('zkstack'),
  slug: 'zkstack',
  name: 'ZK stack',
  shortName: undefined,
  addedAt: UnixTime(1769781273),
  interopConfig: {
    bridgeType: 'lockAndMint',
    plugins: [
      {
        plugin: 'zkstack',
      },
    ],
  },
  isInteropProtocol: true,
}
