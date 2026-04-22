import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const agglayerCanonical: BaseProject = {
  id: ProjectId('agglayer-canonical'),
  slug: 'agglayer-canonical',
  name: 'Agglayer Canonical',
  shortName: undefined,
  addedAt: UnixTime(1770733275), // 2026-02-10T14:21:15Z
  interopConfig: {
    plugins: [
      {
        plugin: 'agglayer',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'agglayer',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
