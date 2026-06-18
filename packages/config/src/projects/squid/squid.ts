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
        value: 'Intent router',
        description: 'Routes cross-chain swaps through Squid integrations.',
      },
      userRecovery: {
        value: 'Route-dependent',
        description: 'Recovery depends on the selected Squid route.',
      },
      solverAccess: {
        value: 'Integrated executors',
        description:
          'Execution depends on Squid and Axelar route integrations.',
      },
      settlement: {
        value: 'Axelar messaging',
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
