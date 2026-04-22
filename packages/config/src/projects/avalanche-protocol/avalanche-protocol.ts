import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const avalancheProtocol: BaseProject = {
  id: ProjectId('avalanche-protocol'),
  slug: 'avalanche-protocol',
  name: 'Avalanche',
  shortName: undefined,
  addedAt: UnixTime(1773227777), // 2026-03-11T11:16:17Z
  interopConfig: {
    durationSplit: {
      lockAndMint: [
        {
          label: 'Deposit',
          transferTypes: ['avalanche.DepositTransfer'],
        },
        {
          label: 'Withdrawal',
          transferTypes: ['avalanche.WithdrawalTransfer'],
        },
      ],
    },
    plugins: [
      {
        plugin: 'avalanche',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
}
