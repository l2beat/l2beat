import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const debridgeDln: BaseProject = {
  id: ProjectId('debridge-dln'),
  slug: 'debridge-dln',
  name: 'Debridge DLN',
  shortName: undefined,
  addedAt: UnixTime(1768915493),
  interopConfig: {
    description:
      'Intent framework built on top of the deBridge messaging protocol.',
    plugins: [
      {
        plugin: 'debridge-dln',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
