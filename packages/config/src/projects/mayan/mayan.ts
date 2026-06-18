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
        value: 'Intent framework',
        description: 'Solvers compete to fill cross-chain swap intents.',
      },
      userRecovery: {
        value: 'Request refund',
        description:
          'Unfulfilled Swift orders can be refunded from the source contract with a Wormhole or refund-verifier message.',
      },
      solverAccess: {
        value: 'Permissionless',
        description: "'Drivers' (solvers) compete in Mayan auctions.",
      },
      settlement: {
        value: 'Wormhole messaging',
        description:
          'Mayan uses Wormhole messages to prove destination fulfillment or refunds and unlock source-chain funds.',
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
