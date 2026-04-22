import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const zksync2Canonical: BaseProject = {
  id: ProjectId('zksync2-canonical'),
  slug: 'zksync2-canonical',
  name: 'ZKsync Era Canonical',
  shortName: undefined,
  addedAt: UnixTime(1769783599), // 2026-01-30T14:33:19Z
  interopConfig: {
    plugins: [
      {
        plugin: 'zkstack',
        chain: 'zksync2',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
}
