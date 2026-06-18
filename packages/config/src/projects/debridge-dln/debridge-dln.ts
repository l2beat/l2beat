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
    intent: {
      intentModel: {
        value: 'Intent framework',
        description: 'Users create orders that takers can fulfill.',
      },
      userRecovery: {
        value: 'Order cancellation',
        description: 'Unfilled orders can be cancelled through the DLN flow.',
      },
      solverAccess: {
        value: 'Permissionless',
        description: 'Order fulfillment is designed around independent takers.',
      },
      settlement: {
        value: 'deBridge messaging',
        description: 'Order state and settlement use deBridge infrastructure.',
      },
    },
    plugins: [
      {
        plugin: 'debridge-dln',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
