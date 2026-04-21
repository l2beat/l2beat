import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const polygonPosCanonical: BaseProject = {
  id: ProjectId('polygon-pos-canonical'),
  slug: 'polygon-pos-canonical',
  name: 'Polygon PoS Canonical',
  shortName: undefined,
  addedAt: UnixTime(1664808578), // 2022-10-03T14:49:38Z
  interopConfig: {
    name: 'Polygon PoS Canonical',
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
