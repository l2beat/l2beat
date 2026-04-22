import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const avalancheCanonical: BaseProject = {
  id: ProjectId('avalanche-canonical'),
  slug: 'avalanche-canonical',
  name: 'Avalanche Canonical',
  shortName: undefined,
  addedAt: UnixTime(1773227777), // 2026-03-11T11:16:17Z
  interopConfig: {
    name: 'Avalanche Canonical',
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
  isInteropProtocol: true,
}
