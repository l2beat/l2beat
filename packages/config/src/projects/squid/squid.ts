import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const squid: BaseProject = {
  id: ProjectId('squid'),
  slug: 'squid',
  name: 'Squid',
  shortName: undefined,
  addedAt: UnixTime(1769520298),
  interopConfig: {
    description: 'Intent framework using the Axelar message bridge.',
    intent: {
      intentModel: {
        value: 'Intent framework',
        description: 'Routes cross-chain swaps through Squid integrations.',
      },
      userRecovery: {
        value: 'Needs research',
        description:
          'Confirm whether users can cancel or refund a Squid transfer that is not delivered.',
      },
      solverAccess: {
        value: 'Integrated executors',
        description:
          'Execution uses Squid-integrated executors. Confirm exact admission rules.',
      },
      settlement: {
        value: 'Axelar GMP',
        description:
          'Squid routes use Axelar-based cross-chain infrastructure.',
      },
    },
    plugins: [
      {
        plugin: 'axelar',
        transferType: 'axelar-squid.Transfer',
        bridgeType: 'nonMinting',
      },
      {
        plugin: 'squid-coral',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
