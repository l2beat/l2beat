import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../layer2s/common/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('amarok')

export const amarok: Bridge = {
  type: 'bridge',
  id: ProjectId('amarok'),
  display: {
    name: 'Connext Amarok',
    slug: 'amarok',
    description:
      'Connext Amarok is a multilayered system that aggregates various native AMBs in an Hub-and-Spoke architecture with Ethereum being the Hub receiving\
    messages from other domains. Amarok implements a liquidity network on top of its Hub-and-Spoke architecture.\
    Messages from various domains are aggregated into one message root and are periodically sent to Ethereum using native AMBs. Note that for Optimistic Rollups (Arbitrum, Optimism)\
    the AMB is only used as a transport layer, but 7-day delay is being ignored. Upon being delivered to Ethereum these message roots are\
    subsequently aggregated again into a root-of-root of messages before being delivered to their destination domains. Each message can be optimistically fast-forwarded by a network of Routers that will\
    front liquidity (if the message is a token transfer) or post a bond (if the message is a xChain call). Upon receiving the message root via native AMBs Connext Amarok bridge will\
    reconciles messages and return bond to the Routers. There is a configurable delay programmed into the RootManager contract and the SpokeConnectors\
    receiving messages. During the delay period a whitelisted set of Watchers can pause the bridge if the fraudulent message passed via AMB is detected.',
    links: {
      apps: ['https://bridge.connext.network/', 'https://connextscan.io/'],
      websites: ['https://blog.connext.network/'],
      documentation: ['https://docs.connext.network/'],
      repositories: [
        'https://github.com/connext',
        'https://github.com/CoinHippo-Labs/connext-bridge',
      ],
      socialMedia: [
        'https://twitter.com/ConnextNetwork',
        'https://discord.gg/connext',
      ],
    },
  },
  milestones: [
    {
      name: 'Connext Amarok mainnet deployment',
      link: 'https://blog.connext.network/connexts-amarok-upgrade-is-live-683099d61cbb',
      date: '2023-02-02T00:00:00Z',
      description: 'Connext Amarok mainnet deployment.',
    },
    {
      name: 'Connext Amarok announced',
      link: 'https://blog.connext.network/announcing-the-amarok-network-upgrade-5046317860a4',
      date: '2022-05-11T00:00:00Z',
      description:
        'The new, modular architecture for Connext Amarok has been announced.',
    },
  ],
  config: {
    escrows: [
      {
        address: EthereumAddress('0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6'), // Connext main Diamond contract
        sinceTimestamp: new UnixTime(1671625595),
        tokens: ['USDC', 'WETH'],
      },
    ],
  },
  technology: {
    canonical: true,
    category: 'Hybrid',
    destination: ['Gnosis', 'Optimism', 'Arbitrum', 'Polygon', 'BSC'],
  },
  contracts: {
    addresses: [
      {
        name: 'Connext Amarok Bridge',
        address: discovery.getContract('Connext Bridge').address,
        description:
          'The main Connext Amarok contract. Following Diamond design patter, it contains multiple Facets that implement\
        various parts of the bridge functionality.',
        upgradeability: discovery.getContract('Connext Bridge').upgradeability,
      },
      {
        name: 'Root Manager',
        address: discovery.getContract('RootManager').address,
        description:
          'Contract responsible for maintaining list of domains and building root-of-roots of messages. It keeps tracks of all hub connectors that connect to specific domain.',
      },
      {
        name: 'Watcher Manager',
        address: discovery.getContract('Watcher Manager').address,
        description:
          'Contract maintaining a list of Watchers able to stop the bridge if fraud is detected.',
      },
      {
        name: 'MainnetSpokeConnector',
        address: discovery.getContract('MainnetSpokeConnector').address,
        description:
          'Contract that receives messages from other Domains on Ethereum.',
      },
      {
        name: 'MultichainHubConnector',
        address: discovery.getContract('MultichainHubConnector').address,
        description:
          'Contract for sending/receiving messages from mainnet to Binance Smart Chain via Multichain AMB.',
      },
      {
        name: 'PolygonHubConnector',
        address: discovery.getContract('PolygonHubConnector').address,
        description:
          'Contract for sending/receiving messages from mainnet to Polygon via Polygon FxChannel AMB.',
      },
      {
        name: 'GnosisHubConnector',
        address: discovery.getContract('GnosisHubConnector').address,
        description:
          'Contract for sending/receiving messages from mainnet to Gnosis via Gnosis AMB.',
      },
      {
        name: 'OptimismHubConnector',
        address: discovery.getContract('OptimismHubConnector').address,
        description:
          'Contract for sending/receiving messages from mainnet to Optimism via Optimism AMB transport layer. Note that it reads messages from Optimism\
        as soon as Optimism state root is recorded on Ethereum w/out waiting for the 7-day fraud proof delay window.',
      },
      {
        name: 'ArbitrumHubConnector',
        address: EthereumAddress('0xd151C9ef49cE2d30B829a98A07767E3280F70961'),
        description:
          'Contract for sending/receiving messages from mainnet to Optimism via Arbitrum AMB transport layer. Note that it reads messages from Arbitrum\
        as soon as Arbitrum state root is recorded on Ethereum w/out waiting for the 7-day fraud proof delay window.',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Connext MultiSig',
      description:
        '3/3 MultiSig. Owner of the main Connext Amarok Bridge Diamond Proxy. Can upgrade the functionality of any system component with no delay. Maintains the list of Watchers.',
      accounts: [
        {
          address: discovery.getContract('GnosisSafe').address,
          type: 'MultiSig',
        },
      ],
    },
    {
      name: 'Watchers',
      description:
        'Permissioned set of actors who can pause certain bridge components. On Ethereum L1 Watchers can pause RootManager and MainnetSpokeConnector, i.e. modules \
        receiving messages. They can also remove connector from the RootManager. List of watchers is maintained by the Connext MultiSig.',
      accounts: [
        {
          address: EthereumAddress(
            '0x9c77788d761ee0347Ab550883237CeD274a0F248',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xade09131C6f43fe22C2CbABb759636C43cFc181e',
          ),
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Sequencers',
      description:
        'Permissioned set of actors that sequence routers request to forward liquidity.',
      accounts: [],
    },
    {
      name: 'Relayers',
      description:
        'Permissioned set of actors who can perform certain bridge operations.',
      accounts: [],
    },
    {
      name: 'Routers',
      description:
        'Permissioned set of actors who can forward liquidity and speed-up message delivery.',
      accounts: [],
    },
  ],
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '2/3 Validators',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'EOA',
      description: '', //TODO: fill
      sentiment: 'bad',
    },
  },
}
