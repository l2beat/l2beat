import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const zksync2Canonical: BaseProject = {
  id: ProjectId('zksync2-canonical'),
  slug: 'zksync2-canonical',
  name: 'ZKsync Era Canonical',
  shortName: undefined,
  addedAt: UnixTime(1679616000), // 2023-03-24T00:00:00Z
  interopConfig: {
    name: 'ZKsync Era Canonical',
    plugins: [
      {
        plugin: 'zkstack',
        chain: 'zksync2',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
