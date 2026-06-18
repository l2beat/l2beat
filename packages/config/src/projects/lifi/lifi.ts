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
        value: 'Intent Framework (OIF)',
        description: 'Open Intents Framework standard.',
      },
      userRecovery: {
        value: 'Needs research',
        description:
          'Confirm the user recovery path for LI.FI OIF intents, including cancellation or refund conditions.',
      },
      solverAccess: {
        value: 'Curated solvers',
        description:
          'Execution uses LI.FI-integrated solvers. Confirm exact admission rules.',
      },
      settlement: {
        value: 'Needs research',
        description:
          'Confirm the settlement path for tracked LI.FI intent transfers.',
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
