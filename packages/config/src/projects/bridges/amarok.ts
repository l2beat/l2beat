import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('amarok')

export const amarok: Bridge = {
  type: 'bridge',
  id: ProjectId('amarok'),
  display: {
    name: 'Connext',
    slug: 'connext',
    description:
      'Connext is a multilayered system that aggregates various native AMBs in an Hub-and-Spoke architecture with Ethereum being the Hub receiving\
    messages from other domains. It implements a liquidity network on top of its Hub-and-Spoke architecture.',
    category: 'Liquidity Network',
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
    {
      name: 'Bacco Upgrade',
      date: '2023-12-07T00:00:00Z',
      link: 'https://medium.com/connext/introducing-the-bacco-network-upgrade-73ad19cee9ed',
    },
  ],
  config: {
    escrows: [
      {
        address: EthereumAddress('0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6'),
        sinceTimestamp: new UnixTime(1671625595),
        tokens: ['USDC', 'WETH', 'USDT', 'DAI', 'Metis', 'alUSD'],
      },
      // shared ezETH lockbox (xERC20)
      {
        address: EthereumAddress('0xC8140dA31E6bCa19b287cC35531c2212763C2059'),
        sinceTimestamp: new UnixTime(1671625595),
        tokens: ['ezETH'],
      },
    ],
  },
  technology: {
    canonical: false,
    destination: [
      'Gnosis',
      'Optimism',
      'Arbitrum',
      'Polygon',
      'BSC',
      'Base',
      'Linea',
      'Metis',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `
      The bridge can operate in one of two modes, optimistic or native. In both modes, so-called routers can accelerate the bridging by providing liquidity (for token transfers) or a bond (for a crosschain contract call) at the destination.
      
      In optimistic mode the messages (bridging transactions) go through the central Connext sequencer, who reads them from the source chains, then sequences and calculates an aggregate root from them offchain. This aggregate root can be submitted by a relayer at the destination triggering a 120 blocks window where any watcher can turn the system back into native mode thus invalidating the proposed root. Only the owner can set the system back into optimistic Mode. In summary, optimistic mode skips the hub domain (Ethereum in the case of an L2-to-L2 transfer) and native arbitrary message bridges (AMBs) completely.
      
      In native mode messages from various spoke domains are aggregated and periodically sent to Ethereum (hub domain) using the native (non-Connext) AMBs. Note that for Optimistic Rollups (Arbitrum, Optimism) the AMB is only used as a transport layer, and the 7-day delay is ignored. When delivered to the hub domain, these message roots are aggregated again into a root-of-root of messages before being delivered to their destination (spoke domains). A custom \`delayBlocks\` value can be set individually in message-receiving Connext contracts to grant a time delay in which Connext-permissioned watchers could invalidate a potentially fraudulent message from the AMBs before it is considered verified.

      In the case of a Connext router having accelerated a message by fronting liquidity, they will have to wait a certain time to get their liquidity back. This is either the time it takes to pass the message via AMBs (in native mode) and then verify / invalidate it during the \`delayBlocks\` period or pass it via the offchain sequencer (in optimistic mode) and finalize / dispute it during the \`disputeBlocks\` period. In both cases this reconciliation of funds for the router takes longer than the bridging from the point of view of the user, while native mode has the longest delay for reconciliation.`,
      references: [],
      risks: [],
    },
    validation: {
      name: 'Validation via Native AMBs',
      description: `
      `,
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'watchers disconnect certain connectors or pause the whole bridge for no reason.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'native AMBs that Connext uses allow for passing forged messages and this is not caught by Watchers.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'connectors to optimistic rollups (Optimism, Arbitrum) receive a fraudulent message within 7-day fraud-proof window.',
          isCritical: true,
        },
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'ConnextBridge',
        'The main Connext contract. Following Diamond design pattern, it contains multiple Facets that implement\
        various parts of the bridge functionality.',
      ),
      discovery.getContractDetails(
        'RootManager',
        'Contract responsible for maintaining list of domains and building root-of-roots of messages. It keeps tracks of all hub connectors that connect to specific domain.',
      ),
      discovery.getContractDetails(
        'WatcherManager',
        'Contract maintaining a list of Watchers able to stop the bridge if fraud is detected.',
      ),
      discovery.getContractDetails(
        'MainnetSpokeConnector',
        'Contract that receives messages from other Domains on Ethereum.',
      ),
      discovery.getContractDetails(
        'PolygonHubConnector',
        'Contract for sending/receiving messages from mainnet to Polygon via Polygon FxChannel AMB.',
      ),
      discovery.getContractDetails(
        'PolygonZkHubConnector',
        'Contract for sending/receiving messages from mainnet to PolygonZKEVM via PolygonZKEVM AMB.',
      ),
      discovery.getContractDetails(
        'GnosisHubConnector',
        'Contract for sending/receiving messages from mainnet to Gnosis via Gnosis AMB.',
      ),
      discovery.getContractDetails(
        'OptimismHubConnector',
        'Contract for sending/receiving messages from mainnet to Optimism via Optimism AMB transport layer. Note that it reads messages from Optimism\
        as soon as Optimism state root is recorded on Ethereum w/out waiting for the 7-day fraud proof delay window.',
      ),
      discovery.getContractDetails(
        'NewOptimismHubConnector',
        'Contract for sending/receiving messages from mainnet to Optimism, duplicate of OptimismHubConnector.',
      ),
      discovery.getContractDetails(
        'MantleHubConnector',
        'Contract for sending/receiving messages from mainnet to Mantle via Optimism AMB.',
      ),
      discovery.getContractDetails(
        'OptimismV0HubConnector',
        'Contract for sending/receiving messages from mainnet to pre-bedrock Optimism based projects via Optimism AMB.',
      ),
      discovery.getContractDetails(
        'ArbitrumHubConnector',
        'Contract for sending/receiving messages from mainnet to Optimism via Arbitrum AMB transport layer. Note that it reads messages from Arbitrum as soon as Arbitrum state root is recorded on Ethereum w/out waiting for the 7-day fraud proof delay window.',
      ),
      discovery.getContractDetails(
        'WormholeHubConnector',
        'Contract for sending/receiving messages using Wormhole.',
      ),
      discovery.getContractDetails(
        'NewWormholeHubConnector',
        'Contract for sending/receiving messages using Wormhole, duplicate of WormholeHubConnector.',
      ),
      discovery.getContractDetails(
        'LineaHubConnector',
        'Contract for sending/receiving messages from mainnet to Linea via Linea AMB.',
      ),
      discovery.getContractDetails(
        'ModeHubConnector',
        'Contract for sending/receiving messages from mainnet to Mode Network via Optimism AMB.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Connext Multisig',
      'Owner of the main Connext Bridge Diamond Proxy. Can upgrade the functionality of any system component with no delay. Maintains the list of Watchers.',
    ),
    ...discovery.getMultisigPermission(
      'Connext Fee Multisig',
      'Collects fees from the bridge. Can manage Routers through its RouterAdmin role.',
    ),
    {
      name: 'Watchers',
      description:
        'Permissioned set of actors who can pause certain bridge components. On Ethereum L1 Watchers can pause RootManager and MainnetSpokeConnector, i.e. modules receiving messages. They can also remove connector from the RootManager. List of watchers is maintained by the Connext MultiSig.',
      accounts: discovery.getPermissionedAccounts('WatcherManager', 'WATCHERS'),
    },
    {
      name: 'Sequencers',
      description:
        'Permissioned set of actors that sequence routers request to forward liquidity.',
      accounts: discovery.getPermissionedAccounts(
        'ConnextBridge',
        'SEQUENCERS',
      ),
    },
    {
      name: 'Relayers',
      description:
        'Permissioned set of actors who can perform certain bridge operations.',
      accounts: discovery.getPermissionedAccounts('ConnextBridge', 'RELAYERS'),
    },
    {
      name: 'Routers',
      description:
        'Permissioned set of actors who can forward liquidity and speed-up message delivery.',
      accounts: discovery.getPermissionedAccounts('ConnextBridge', 'ROUTERS'),
    },
  ],
  riskView: {
    validatedBy: {
      value: 'Various AMBs',
      description:
        'For BNB Multichain is used, for other chains their native AMBs are used.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'YES',
      description: 'Connext can be upgraded by 3/3 MultiSig',
      sentiment: 'bad',
    },
  },
}
