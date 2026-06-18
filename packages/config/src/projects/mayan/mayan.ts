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
    intent: {
      intentModel: {
        value: 'Auction bridge',
        description: 'Solvers compete to fill cross-chain swap intents.',
      },
      userRecovery: {
        value: 'Protocol-specific',
        description: 'Recovery depends on the Mayan transfer path.',
      },
      solverAccess: {
        value: 'Auction solvers',
        description: 'Fillers compete in the Mayan solver flow.',
      },
      settlement: {
        value: 'Wormhole messaging',
        description: 'Mayan uses Wormhole-based cross-chain infrastructure.',
      },
    },
    plugins: [
      {
        plugin: 'mayan-swift',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
