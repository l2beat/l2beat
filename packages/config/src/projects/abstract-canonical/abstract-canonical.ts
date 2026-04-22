import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const abstractCanonical: BaseProject = {
  id: ProjectId('abstract-canonical'),
  slug: 'abstract-canonical',
  name: 'Abstract Canonical',
  shortName: undefined,
  addedAt: UnixTime(1769783599), // 2026-01-30T14:33:19Z
  interopConfig: {
    plugins: [
      {
        plugin: 'zkstack',
        chain: 'abstract',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
}
