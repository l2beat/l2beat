import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const celoCanonical: BaseProject = {
  id: ProjectId('celo-canonical'),
  slug: 'celo-canonical',
  name: 'Celo Canonical',
  shortName: undefined,
  addedAt: UnixTime(1718876598), // '2024-06-20T09:43:18Z'
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
