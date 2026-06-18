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
        value: 'HTLC',
        description: 'Cross-chain swaps use hash time locks.',
      },
      userRecovery: {
        value: 'Timeout refund',
        description:
          'HTLC construction provides a timeout-based recovery path.',
      },
      solverAccess: {
        value: 'Needs research',
        description:
          'Confirm whether resolver participation is permissionless, allowlisted, or otherwise curated.',
      },
      settlement: {
        value: 'HTLC',
        description: 'Settlement follows the HTLC atomic swap.',
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
