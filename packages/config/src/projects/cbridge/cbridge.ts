import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../..'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const _discovery = new ProjectDiscovery('cbridge')

export const cbridge: BaseProject = {
  id: ProjectId('cbridge'),
  slug: 'cbridge',
  name: 'Celer cBridge',
  shortName: 'cBridge',
  addedAt: UnixTime(1662628329),
  interopConfig: {
    intent: {
      intentModel: {
        value: 'Liquidity network',
        description: 'Transfers are filled from the liquidity pool.',
      },
      userRecovery: {
        value: 'Request refund',
        sentiment: 'bad',
        description:
          'There is no onchain refund option. Failed pool transfers can be withdrawn on the source chain using gateway data signed by the Celer SGN.',
      },
      solverAccess: {
        value: 'Internal',
        sentiment: 'bad',
        description:
          'Solvers provide the signatures of the offchain Celer signer quorum with their transaction.',
      },
      settlement: {
        value: 'Celer SGN',
        description:
          'Relay and refund messages must be authorized by a Celer signer quorum.',
      },
    },
    plugins: [
      {
        plugin: 'celer',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
