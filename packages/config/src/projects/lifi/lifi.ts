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
        value: 'Intent aggregator',
        description: 'Routes user intents across integrated liquidity sources.',
      },
      userRecovery: {
        value: 'Route-dependent',
        description: 'Recovery depends on the selected LI.FI route.',
      },
      solverAccess: {
        value: 'Curated solvers',
        description:
          'Execution depends on LI.FI solver and route integrations.',
      },
      settlement: {
        value: 'Route-dependent',
        description: 'Settlement depends on the selected underlying route.',
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
