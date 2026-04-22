import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const abstractProtocol: BaseProject = {
  id: ProjectId('abstract-protocol'),
  slug: 'abstract-protocol',
  name: 'Abstract',
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
