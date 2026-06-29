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
        value: 'Request refund',
        sentiment: 'bad',
        description:
          'There is no onchain refund option. The central liquidity pool implementation source code is unavailable.',
      },
      solverAccess: {
        value: 'Permissionless',
        description:
          'Execution depends on Meson LPs locking destination-chain liquidity in the smart contract escrow. Execution is permissionless but needs offchain signatures by the centralized oracle.',
      },
      settlement: {
        value: 'Internal',
        sentiment: 'bad',
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
