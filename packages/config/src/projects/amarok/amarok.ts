import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('amarok')

const mainnetSpokedelayBlocks = discovery.getContractValue<number>(
  'MainnetSpokeConnector',
  'delayBlocks',
)

const mainnetSpokedisputeBlocks = discovery.getContractValue<number>(
  'MainnetSpokeConnector',
  'disputeBlocks',
)

const paused = discovery.getContractValue<boolean>('ConnextBridge', 'paused')

export const amarok: Bridge = {
  type: 'bridge',
  id: ProjectId('amarok'),
  addedAt: UnixTime(1680097524), // 2023-03-29T13:45:24Z
  display: {
    name: 'Connext',
    slug: 'connext',
    warning:
      'This project [is winding down](https://bridge.connext.network/) and operations are migrating to [the Everclear Hub](https://l2beat.com/scaling/projects/everclear).' +
      (paused ? ' The main bridge escrow is paused.' : ''),
    description:
      'Connext is a multilayered system that aggregates various native AMBs in a Hub-and-Spoke architecture with Ethereum being the Hub receiving\
    messages from other domains. It implements a liquidity network on top of its Hub-and-Spoke architecture.',
    category: 'Liquidity Network',
    links: {
      bridges: ['https://bridge.connext.network/', 'https://connextscan.io/'],
      websites: ['https://connext.network/'],
      documentation: ['https://docs.connext.network/'],
      explorers: ['https://explorer.everclear.org/intents'],
      repositories: ['https://github.com/connext/monorepo'],
      socialMedia: [
        'https://x.com/EverclearOrg',
        'https://discord.com/invite/everclear',
      ],
    },
  },
  milestones: [
    {
      title: 'Connext Amarok mainnet deployment',
      url: 'https://blog.connext.network/connexts-amarok-upgrade-is-live-683099d61cbb',
      date: '2023-02-02T00:00:00Z',
      description: 'Connext Amarok mainnet deployment.',
      type: 'general',
    },
    {
      title: 'Connext Amarok announced',
      url: 'https://blog.connext.network/announcing-the-amarok-network-upgrade-5046317860a4',
      date: '2022-05-11T00:00:00Z',
      description:
        'The new, modular architecture for Connext Amarok has been announced.',
      type: 'general',
    },
    {
      title: 'Bacco Upgrade',
      date: '2023-12-07T00:00:00Z',
      url: 'https://medium.com/connext/introducing-the-bacco-network-upgrade-73ad19cee9ed',
      type: 'general',
    },
  ],
  config: {
    associatedTokens: ['NEXT'],
    escrows: [
      {
        address: EthereumAddress('0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6'),
        sinceTimestamp: UnixTime(1671625595),
        tokens: ['USDC', 'WETH', 'USDT', 'DAI', 'Metis', 'alUSD'],
        chain: 'ethereum',
      },
      // shared ezETH lockbox (xERC20)
      {
        address: EthereumAddress('0xC8140dA31E6bCa19b287cC35531c2212763C2059'),
        sinceTimestamp: UnixTime(1671625595),
        tokens: ['ezETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x22f424Bca11FE154c403c277b5F8dAb54a4bA29b'),
        sinceTimestamp: UnixTime(1693790555),
        tokens: ['NEXT'],
        chain: 'ethereum',
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
      'PolygonZkEVM',
      'xLayer',
      'Wormhole',
      'Mantle',
      'Mode',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `
The bridge can operate in one of two modes: Optimistic or Native. In both modes, so-called routers can accelerate the bridging for users by fronting liquidity (for token transfers) or a bond (for crosschain contract calls) at the destination. The routers are reimbursed after the message has arrived at the destination through one of the two modes.

In optimistic mode the messages (bridging transactions) go through the central Connext sequencer, who reads them from the source chains, then sequences them and calculates an aggregate root offchain. This aggregate root can be proposed by a relayer at the destination triggering a \`disputeBlocks\` window where any watcher can turn the system back into native mode, invalidating the proposed root. Only the owner can set the system back into optimistic mode. Non-invalidated roots get finalized after \`disputeBlocks\`. In summary, optimistic mode skips the hub domain (Ethereum in the case of an L2-to-L2 transfer) and native arbitrary message bridges (AMBs) completely.

In native mode, messages from various spoke domains are aggregated and periodically sent to Ethereum (hub domain) using the native (non-Connext) AMBs. When delivered to the hub domain, these message roots are aggregated again into a root-of-root of messages before being delivered to their destination (spoke domains). A custom \`delayBlocks\` value can be set individually in message-receiving Connext contracts to grant a time delay in which Connext-permissioned watchers could invalidate a potentially fraudulent message from the AMBs.

In the case of a Connext router having accelerated a message by fronting liquidity, they will have to wait a certain time to get their liquidity back. In native mode, this is the time it takes to pass the message via AMBs and then verify / invalidate it during the \`delayBlocks\` period. In optimistic mode, it is the time to pass it via the offchain sequencer and finalize / dispute it during the \`disputeBlocks\` period. In both cases this reconciliation of funds for the router takes longer than the bridging for the user, while native mode has the longest delay for reconciliation.

Although the values can be different for every message-receiving contract on each chain, current examples are ${mainnetSpokedelayBlocks} blocks for \`delayBlocks\` and ${mainnetSpokedisputeBlocks} blocks for \`disputeBlocks\` on the MainnetSpokeConnector on Ethereum.`,
      references: [],
      risks: [],
    },
    validation: {
      name: 'Validation',
      description: `
      For speed, users mainly depend on the bids of routers to fulfill their bridging transactions at the destination. But ultimately, after a message has been passed to the destination via the optimistic or native way and the delay period has passed for watchers to invalidate it, there is no router needed to execute at the destination. This means that the users are ultimately dependent on the correct functioning of the sequencer or the AMBs, and the watchers. Note that for Optimistic Rollups (Arbitrum, Optimism) the AMB is (during Connext native mode) only used  as a transport layer, and the 7-day optimistic challenge period is ignored.`,
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'watchers disconnect certain connectors or pause the whole bridge.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'native AMBs that Connext uses or the centralized sequencer (in optimistic mode) forges messages and this is not caught by the watchers.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'connectors to optimistic rollups receive a fraudulent message within 7-day fraud-proof window and this is not caught by the watchers.',
        },
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
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
          'Contract for sending/receiving messages from mainnet to PolygonZkEVM via PolygonZkEVM AMB (shared PolygonZkEVMBridge).',
        ),
        discovery.getContractDetails(
          'xLayerZkHubConnector',
          'Contract for sending/receiving messages from mainnet to PolygonZkEVM via X Layer AMB (shared PolygonZkEVMBridge).',
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
          'BaseHubConnector',
          'Contract for sending/receiving messages from mainnet to Base via OP stack AMB.',
        ),
        discovery.getContractDetails(
          'MantleHubConnector',
          'Contract for sending/receiving messages from mainnet to Mantle via OP stack AMB.',
        ),
        discovery.getContractDetails(
          'MetisHubConnector',
          'Contract for sending/receiving messages from mainnet to Metis via Optimism AMB.',
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
          'Contract for sending/receiving messages from mainnet to Mode Network via OP stack AMB.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'Connext Multisig',
          'Owner of the main Connext Bridge Diamond Proxy. Can upgrade the functionality of any system component with no delay. Maintains the list of Watchers.',
        ),
        discovery.getMultisigPermission(
          'Connext Fee Multisig',
          'Collects fees from the bridge. Can manage Routers through its RouterAdmin role.',
        ),
        discovery.getPermissionDetails(
          'Watchers',
          discovery.getPermissionedAccounts('WatcherManager', 'WATCHERS'),
          'Permissioned set of actors who can pause certain bridge components. On Ethereum L1 Watchers can pause RootManager and MainnetSpokeConnector, i.e. modules receiving messages. They can also remove connectors from the RootManager. List of watchers is maintained by the Connext MultiSig.',
        ),
        discovery.getPermissionDetails(
          'Sequencer',
          discovery.getPermissionedAccounts('ConnextBridge', 'SEQUENCERS'),
          'Permissioned actor that collects bids from all chains, aggregates them and randomly selects router(s) to fulfill them. The sequencer will post batches of these bids to a relayer network, which will submit them to the destination chain',
        ),
        discovery.getPermissionDetails(
          'Relayers',
          discovery.getPermissionedAccounts('ConnextBridge', 'RELAYERS'),
          'Permissioned set of actors who can perform certain bridge operations as a service.',
        ),
        discovery.getPermissionDetails(
          'Routers',
          discovery.getPermissionedAccounts('ConnextBridge', 'ROUTERS'),
          'Permissioned set of actors who can front liquidity, speeding up message delivery.',
        ),
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Various AMBs',
      description:
        'For BNB Multichain is used, for other chains their native AMBs are used.',
      sentiment: 'warning',
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
