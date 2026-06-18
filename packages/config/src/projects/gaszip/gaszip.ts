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
        value: 'Protocol-specific',
        description: 'Recovery depends on Gas.zip transfer handling.',
      },
      solverAccess: {
        value: 'Protocol-operated',
        description: 'Not primarily exposed as an open solver marketplace.',
      },
      settlement: {
        value: 'Gas.zip routing',
        description: 'Settled through Gas.zip route execution.',
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
