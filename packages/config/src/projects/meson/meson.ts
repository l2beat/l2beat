import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const meson: BaseProject = {
  id: ProjectId('meson'),
  slug: 'meson',
  name: 'Meson',
  shortName: undefined,
  addedAt: UnixTime(1772110772),
  interopConfig: {
    plugins: [
      {
        plugin: 'meson',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
  isInteropProtocol: true,
}
