import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const polygonPosCanonical: BaseProject = {
  id: ProjectId('polygon-pos-canonical'),
  slug: 'polygon-pos-canonical',
  name: 'Polygon PoS Canonical',
  shortName: undefined,
  addedAt: UnixTime(1769783599), // 2026-01-30T14:33:19Z
  interopConfig: {
    durationSplit: {
      lockAndMint: [
        {
          label: 'Deposit',
          transferTypes: ['polygon.L1ToL2Transfer'],
        },
        {
          label: 'Withdrawal',
          transferTypes: ['polygon.L2ToL1Transfer'],
        },
      ],
    },
    plugins: [
      {
        plugin: 'polygon',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
