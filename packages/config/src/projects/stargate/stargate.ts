import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('stargate')

export const stargate: BaseProject = {
  id: ProjectId('stargate'),
  slug: 'stargate',
  name: 'Stargate',
  shortName: undefined,
  addedAt: UnixTime(1718620600),
  interopConfig: {
    description:
      'Liquidity bridge focused on USD stablecoins and ETH using the LayerZero message bridge. Stargate also has a Hydra product which is a minting token bridge for chains that do not natively support Stargate assets.',
    intent: {
      intentModel: {
        value: 'Liquidity bridge',
        description: 'Transfers use Stargate liquidity and omnichain routing.',
      },
      userRecovery: {
        value: 'Needs research',
        description:
          'Confirm the recovery path for failed or unfilled Stargate transfers.',
      },
      solverAccess: {
        value: 'Permissionless',
        description:
          'Execution is permissionless via LayerZero and Stargate liquidity pools.',
      },
      settlement: {
        value: 'LayerZero messaging',
        description: 'Stargate uses LayerZero-based cross-chain messaging.',
      },
    },
    plugins: [
      {
        plugin: 'stargate',
        bridgeType: 'nonMinting',
      },
      {
        plugin: 'stargate',
        bridgeType: 'lockAndMint',
      },
    ],
    durationSplit: {
      lockAndMint: [
        {
          label: 'Bus',
          transferTypes: ['stargate-v2-bus.Transfer'],
        },
        {
          label: 'Taxi',
          transferTypes: ['stargate-v2-taxi.Transfer'],
        },
      ],
      nonMinting: [
        {
          label: 'Bus',
          transferTypes: ['stargate-v2-bus.Transfer'],
        },
        {
          label: 'Taxi',
          transferTypes: ['stargate-v2-taxi.Transfer'],
        },
      ],
    },
    type: 'intent',
  },
}
