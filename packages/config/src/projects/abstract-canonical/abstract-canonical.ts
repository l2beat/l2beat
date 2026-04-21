import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const abstractCanonical: BaseProject = {
  id: ProjectId('abstract-canonical'),
  slug: 'abstract-canonical',
  name: 'Abstract Canonical',
  shortName: undefined,
  addedAt: UnixTime(1737936000), // 2025-01-27T00:00:00Z
  interopConfig: {
    name: 'Abstract Canonical',
    plugins: [
      {
        plugin: 'zkstack',
        chain: 'abstract',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
