import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const meson: BaseProject = {
  id: ProjectId('meson'),
  slug: 'meson',
  name: 'Meson',
  shortName: undefined,
  addedAt: UnixTime(1772110772),
  interopConfig: {
    description: 'Liquidity bridge specialised on alt-L1s.',
    intent: {
      intentModel: {
        value: 'Liquidity network',
        description:
          'Transfers are filled from a central liquidity pool on each chain.',
      },
      userRecovery: {
        value: 'Needs research',
        description:
          'Confirm whether users can cancel or refund an unfilled Meson swap and under what conditions.',
      },
      solverAccess: {
        value: 'LP network',
        description: 'Execution depends on available Meson liquidity.',
      },
      settlement: {
        value: 'Meson contracts',
        description: 'Settled through Meson bridge contracts.',
      },
    },
    plugins: [
      {
        plugin: 'meson',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
