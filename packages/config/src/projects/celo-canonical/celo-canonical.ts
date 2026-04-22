import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const celoCanonical: BaseProject = {
  id: ProjectId('celo-canonical'),
  slug: 'celo-canonical',
  name: 'Celo Canonical',
  shortName: undefined,
  addedAt: UnixTime(1772615885), // 2026-03-04T09:18:05Z
  interopConfig: {
    name: 'Celo Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: [
            'opstack.L1ToL2Transfer',
            'opstack-standardbridge.L1ToL2Transfer',
          ],
        },
        {
          label: 'L2 -> L1',
          transferTypes: [
            'opstack.L2ToL1Transfer',
            'opstack-standardbridge.L2ToL1Transfer',
          ],
        },
      ],
    },
    plugins: [
      {
        chain: 'celo',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'celo',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
