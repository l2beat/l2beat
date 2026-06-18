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
        value: 'Liquidity pool',
        description: 'Transfers are routed through liquidity providers.',
      },
      userRecovery: {
        value: 'Needs research',
        description:
          'Confirm whether users can cancel or refund an unfilled transfer and under what conditions.',
      },
      solverAccess: {
        value: 'LP network',
        description:
          'Transfers are served by Celer liquidity providers. LP admission rules still need confirmation.',
      },
      settlement: {
        value: 'Celer SGN',
        description:
          'Settlement is coordinated through Celer infrastructure. Confirm exact SGN role for the tracked flow.',
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
