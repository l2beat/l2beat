import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const lifi: BaseProject = {
  id: ProjectId('lifi'),
  slug: 'lifi',
  name: 'LI.FI',
  shortName: undefined,
  addedAt: UnixTime(1780394699),
  interopConfig: {
    description:
      'Intent protocol implemented by LI.FI, based on the Open Intents Framework (OIF).',
    intent: {
      intentModel: {
        value: 'Intent framework (OIF)',
        description: 'Uses the Open Intents Framework standard.',
      },
      userRecovery: {
        value: 'Timeout refund',
        description:
          'Escrow orders can be refunded after expiry; Compact orders expire without moving locked funds unless fills are proven in time.',
      },
      solverAccess: {
        value: 'Permissionless',
        description:
          'Whitelisted solvers have access to an internal API and marketplace but in general solving is permissionless in OIF.',
      },
      settlement: {
        value: 'OIF settlement',
        description:
          'Solvers fill destination outputs, then claim source inputs after oracle proofs of the fills. Oracles are configurable by LiFi.',
      },
    },
    plugins: [
      {
        plugin: 'lifi-intents',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
