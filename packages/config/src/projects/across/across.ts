import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('across')

export const across: BaseProject = {
  id: ProjectId('across'),
  slug: 'across',
  name: 'Across',
  shortName: undefined,
  addedAt: UnixTime(1712746402),
  interopConfig: {
    description:
      'Intent framework specialised on popular chains and assets, speed and security.',
    intent: {
      intentModel: {
        value: 'Intent framework',
        description:
          'General, open, multi-token architecture where relayers compete to fill crosschain-transfer intents.',
      },
      userRecovery: {
        value: 'Slow-fill fallback',
        description:
          'If no relayer fast-fills a deposit, Across can complete it through the protocol slow-fill path.',
      },
      solverAccess: {
        value: 'Permissionless',
        description: 'Relayers compete to fill deposits and receive repayment.',
      },
      settlement: {
        value: 'Optimistic',
        description:
          'Relayer repayment is settled through the Across system and can be escalated to token voting via UMA.',
      },
    },
    plugins: [
      {
        plugin: 'across',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
