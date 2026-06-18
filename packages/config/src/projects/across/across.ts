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
        value: 'Optimistic liquidity relay',
        description: 'Relayers fill user deposits on the destination chain.',
      },
      userRecovery: {
        value: 'Fallback fill path',
        description:
          'Designed around relayer fills with protocol fallback for unfilled deposits.',
      },
      solverAccess: {
        value: 'Open relayers',
        description: 'Relayers compete to fill deposits and receive repayment.',
      },
      settlement: {
        value: 'UMA optimistic settlement',
        description: 'Relayer repayment is settled through the Across system.',
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
