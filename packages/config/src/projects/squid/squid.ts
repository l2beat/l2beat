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
        value: 'Express Execution',
        description:
          'Solvers fill standard Axelar transfers before they arrive at the destination.',
      },
      userRecovery: {
        value: 'Slow fallback',
        description:
          'Transfers are not cancellable but fall back to standard Axelar bridge (minting) transfers if they are not filled.',
      },
      solverAccess: {
        value: 'Permissionless',
        description:
          'Anyone can front liquidity by calling expressExecuteWithToken()',
      },
      settlement: {
        value: 'Axelar',
        description: 'Standard Axelar GMP token transfers.',
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
