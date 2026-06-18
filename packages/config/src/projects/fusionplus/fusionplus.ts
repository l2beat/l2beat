import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const fusionplus: BaseProject = {
  id: ProjectId('fusionplus'),
  slug: 'fusionplus',
  name: '1inch Fusion+',
  shortName: undefined,
  addedAt: UnixTime(1770021647),
  interopConfig: {
    description: 'Hash time lock (HTLC) based intent framework built by 1inch.',
    intent: {
      intentModel: {
        value: 'HTLC swap',
        description: 'Cross-chain swaps use hash time locks.',
      },
      userRecovery: {
        value: 'Timeout refund',
        description:
          'HTLC construction provides a timeout-based recovery path.',
      },
      solverAccess: {
        value: 'Resolver network',
        description:
          'Resolvers compete or are selected through the 1inch flow.',
      },
      settlement: {
        value: 'Atomic swap settlement',
        description: 'Settlement follows the HTLC execution path.',
      },
    },
    plugins: [
      {
        plugin: 'oneinch-fusion-plus',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
