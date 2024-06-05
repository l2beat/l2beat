import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('real')

export const real: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Re.al',
    slug: 'real',
    description:
      'Reya is an Arbitrum Orbit stack L2 with AnyTrust data availability, optimizing for trading and liquidity provision.',
    purposes: ['DeFi', 'AMM', 'Exchange'],
    links: {
      websites: ['https://reya.network/'],
      apps: [
        'https://reya.network/lge',
        'https://bridge.gelato.network/bridge/reya-network',
      ],
      documentation: ['https://docs.reya.network/'],
      explorers: ['https://explorer.reya.network/'],
      repositories: ['https://github.com/Reya-Labs'],
      socialMedia: [
        'https://twitter.com/Reya_xyz',
        'https://discord.gg/reyaxyz',
        'https://medium.com/reya-labs',
      ],
    },
  },
  chainConfig: {
    name: 'reya',
    chainId: 1729,
    explorerUrl: 'https://explorer.reya.network',
    explorerApi: {
      url: 'https://explorer.reya.network/api',
      type: 'blockscout',
    },
    multicallContracts: [],
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-04-23T00:00:00Z')),
  },
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: '',
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'GelatoMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
  ],
  milestones: [
    {
      name: 'Reya DEX launch',
      link: 'https://x.com/reya_xyz/status/1793296498727485712',
      date: '2024-05-21T00:00:00Z',
      description:
        'Reya DEX launches with Perpetual trading available for ETH and BTC.',
    },
    {
      name: 'Reya LGE',
      link: 'https://medium.com/reya-labs/reya-network-the-first-trading-optimised-l2-liquidity-generation-event-launch-f3cd958302ec',
      date: '2024-04-22T00:00:00Z',
      description:
        'Reya launches with a Liquidity Generation Event (LGE) where users can provide USDC to the network.',
    },
  ],
})
