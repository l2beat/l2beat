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
  // TODO!: when added, remove it from filter in config.test.ts
  interopConfig: {
    intent: {
      intentModel: {
        value: 'Liquidity network',
        description: 'Transfers are routed through liquidity providers.',
      },
      userRecovery: {
        value: 'Protocol-specific',
        description:
          'Recovery depends on the transfer path and liquidity state.',
      },
      solverAccess: {
        value: 'Liquidity providers',
        description:
          'The active market is defined by available bridge liquidity.',
      },
      settlement: {
        value: 'Celer network',
        description: 'Settled through Celer bridge infrastructure.',
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
