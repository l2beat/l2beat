import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'
import { WORMHOLE_DETAILED_DESCRIPTION } from '../wormhole/shared'

export const mayan: BaseProject = {
  id: ProjectId('mayan'),
  slug: 'mayan',
  name: 'Mayan',
  shortName: undefined,
  addedAt: UnixTime(1771847938),
  interopConfig: {
    description: 'Intent framework using the Wormhole message bridge.',
    detailedDescription: WORMHOLE_DETAILED_DESCRIPTION,
    plugins: [
      {
        plugin: 'mayan-swift',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
