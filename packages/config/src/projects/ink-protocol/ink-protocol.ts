import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const inkProtocol: BaseProject = {
  id: ProjectId('ink-protocol'),
  slug: 'ink-protocol',
  name: 'Ink Canonical',
  shortName: undefined,
  addedAt: UnixTime(1772801290), // 2026-03-06T12:48:10Z
  interopConfig: {
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
        chain: 'ink',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'ink',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
}
