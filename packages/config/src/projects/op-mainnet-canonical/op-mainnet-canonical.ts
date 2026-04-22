import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const opMainnetCanonical: BaseProject = {
  id: ProjectId('op-mainnet-canonical'),
  slug: 'op-mainnet-canonical',
  name: 'OP Canonical',
  shortName: undefined,
  addedAt: UnixTime(1768312035), // 2026-01-13T13:47:15Z
  interopConfig: {
    name: 'OP Canonical',
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
          ],
        },
        {
          label: 'L2 -> L1',
          transferTypes: [
            'opstack.L2ToL1Transfer',
            'opstack-standardbridge.L2ToL1Transfer',
            'maker-bridge.L2ToL1Transfer',
            'lido-wsteth.L2ToL1Transfer',
          ],
        },
      ],
    },
    plugins: [
      {
        chain: 'optimism',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'optimism',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'optimism',
        plugin: 'beefy-bridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'optimism',
        plugin: 'maker-bridge',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'optimism',
        plugin: 'sorare-base',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'optimism',
        plugin: 'lido-wsteth',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'optimism',
        plugin: 'synthetix-bridge',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'canonical',
  },
  isInteropProtocol: true,
}
