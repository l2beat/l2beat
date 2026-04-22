import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const lineaCanonical: BaseProject = {
  id: ProjectId('linea-canonical'),
  slug: 'linea-canonical',
  name: 'Linea Canonical',
  shortName: undefined,
  addedAt: UnixTime(1772631490), // 2026-03-04T13:38:10Z
  interopConfig: {
    name: 'Linea Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: ['linea.L1ToL2Transfer'],
        },
        {
          label: 'L2 -> L1',
          transferTypes: ['linea.L2ToL1Transfer'],
        },
      ],
    },
    plugins: [
      {
        plugin: 'linea',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
