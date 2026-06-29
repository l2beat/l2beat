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
        value: 'Request refund',
        sentiment: 'bad',
        description:
          'There is no onchain refund option. No self-serve onchain cancellation or refund path; invalid deposits are handled through Gas.zip support.',
      },
      solverAccess: {
        value: 'Internal',
        sentiment: 'bad',
        description: 'No open solver marketplace.',
      },
      settlement: {
        value: 'Internal',
        sentiment: 'bad',
        description:
          'Settled through Gas.zip internal, centralized accounting.',
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
