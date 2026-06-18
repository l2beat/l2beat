import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const gaszip: BaseProject = {
  id: ProjectId('gaszip'),
  slug: 'gaszip',
  name: 'Gas.zip',
  shortName: undefined,
  addedAt: UnixTime(1769070497),
  interopConfig: {
    description:
      'Intent-based centralised EOA bridge used for gas token transfers, optimised for speed and diverse chain support.',
    intent: {
      intentModel: {
        value: 'Gas refuel',
        description: 'Focused on sending small gas balances across chains.',
      },
      userRecovery: {
        value: 'Needs research',
        description:
          'Confirm whether users can cancel or refund a transfer that is not delivered.',
      },
      solverAccess: {
        value: 'Internal',
        description: 'No open solver marketplace exposed.',
      },
      settlement: {
        value: 'Internal',
        description: 'Settled through Gas.zip internal, centralized acounting.',
      },
    },
    plugins: [
      {
        plugin: 'gaszip',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
