import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const baseCanonical: BaseProject = {
  id: ProjectId('base-canonical'),
  slug: 'base-canonical',
  name: 'Base Canonical',
  shortName: undefined,
  addedAt: UnixTime(1689206400), // 2023-07-13T00:00:00Z
  interopConfig: {
    name: 'Base Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: [
            'opstack.L1ToL2Transfer',
            'opstack-standardbridge.L1ToL2Transfer',
            'beefy-bridge.L1ToL2Transfer',
            'maker-bridge.L1ToL2Transfer',
            'sorare-base.L1ToL2Transfer',
            'lido-wsteth.L1ToL2Transfer',
            'sky-bridge.L1ToL2Transfer',
          ],
        },
        {
          label: 'L2 -> L1',
          transferTypes: [
            'opstack.L2ToL1Transfer',
            'opstack-standardbridge.L2ToL1Transfer',
            'maker-bridge.L2ToL1Transfer',
            'lido-wsteth.L2ToL1Transfer',
            'sky-bridge.L2ToL1Transfer',
          ],
        },
      ],
    },
    plugins: [
      {
        chain: 'base',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'beefy-bridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'maker-bridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'sorare-base',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'lido-wsteth',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'base',
        plugin: 'sky-bridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
