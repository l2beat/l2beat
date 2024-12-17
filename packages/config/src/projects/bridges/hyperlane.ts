import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const PROJECT_ID = ProjectId('hyperlane')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())

export const hyperlane: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  createdAt: new UnixTime(1733828344), // 2024-12-10T10:59:22Z
  display: {
    name: 'Hyperlane',
    slug: 'hyperlane',
    warning:
      'The security parameters of each Token Router and non-default ISM module must be individually assessed, and can be changed by their developers.',
    category: 'Token Bridge',
    links: {
      websites: ['https://hyperlane.xyz/'],
      apps: [], // it's just a framework
      repositories: ['https://github.com/hyperlane-xyz'],
      documentation: ['https://docs.hyperlane.xyz/'],
      socialMedia: [
        'https://x.com/hyperlane',
        'https://discord.com/invite/VK9ZUy3aTV',
      ],
    },
    description:
      'Hyperlane is an interoperability protocol for cross-chain communication. It facilitates token bridging between chains through the Hyperchain message passing infrastructure.',
    detailedDescription: `It allows developers to create interchain token bridges by deploying Hyperlane Warp Route contracts and leveraging the Hyperlane Mailbox infrastructure deployed to each chain.
        Hyperlane deployments can be configured with a custom Interchain Security Module (ISM), which specifies the security model to use. If no custom ISM is configured, the default ISM module will be used.`,
  },
  config: {
    escrows: [],
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description: `.`,
      sentiment: 'warning',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: [
      'Optimism',
      'Polygon',
      'Boba',
      'Arbitrum',
      'ZkSync Era',
      'Linea',
      'Base',
      'Aleph Zero EVM',
      'Ancient8',
      'ApeChain',
      'AppChain',
      'Arbitrum Nova',
      'Astar',
      'Astar zkEVM',
      'Avalanche',
      'B3',
      'Bitlayer',
      'Blast',
      'BOB',
      'Boba Mainnet',
      'Binance Smart Chain',
      'BSquared Network',
      'Celo',
      'CheeseChain',
      'Chiliz',
      'Core',
      'Cyber',
      'Degen',
      'Dogechain',
      'DuckChain',
      'Eclipse',
      'Endurance',
      'Ethereum',
      'Everclear',
      'Fantom Opera',
      'Flame',
      'Flare',
      'EVM on Flow',
      'Fraxtal',
      'Fuse',
      'Gnosis',
      'Gravity Alpha Mainnet',
      'Harmony One',
      'Immutable zkEVM',
      'Injective EVM',
      'Injective',
      'Kaia',
      'Kroma',
      'Lisk',
      'LUKSO',
      'Lumia Prism',
      'Manta Pacific',
      'Mantle',
      'Merlin',
      'Metal L2',
      'Metis Andromeda',
      'Mint',
      'Mode',
      'Molten',
      'Moonbeam',
      'Morph',
      'Neutron',
      'Oort',
      'Orderly L2',
      'Polynomial',
      'Prom',
      'Proof of Play Apex',
      'RARI Chain',
      're.al',
      'Redstone',
      'Rootstock',
      'Sanko',
      'Scroll',
      'Sei',
      'Shibarium',
      'SnaxChain',
      'Solana',
      'Superposition',
      'Superseed',
      'Swell',
      'Taiko',
      'Tangle',
      'Treasure',
      'Unichain',
      'Vana',
      'Viction',
      'World Chain',
      'Xai',
      'XLayer',
      'Zero Network',
      'ZetaChain',
      'Zircuit',
      'zkLink Nova',
      'Zora',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `Hyperlane infrastructure consists of three main components: Mailbox-es (two, one on the origin chain and one on the destination chain), an Interchain Security Model (ISM), and a Relayer.
        The Mailbox is a contract responsible for dispatching and processing messages between the chains. The ISM contract defines the security model for the bridge. 
        Unless overridden with a custom ISM by the application, the default multisig ISM is used. The default ISM validates messages by verifying that a quorum of signatures from a set of configured validators is reached.  \n

        Although designed for arbitrary message transfers, the main application of the Hyperlane protocol is token bridging across chains. 
        To initiate a token transfer, users call the transferRemote() function of the application token router. Depending on the specific token router, users’ tokens may be wrapped, burned, or locked.
        The transfer function eventually dispatches a message to the origin chain Mailbox, emitting a Dispatch event. Off-chain agents, such as ISM validators and Relayers, monitor the Mailbox contract events and index each dispatched message. 
        ISM validators sign off on messages by producing attestations (called checkpoints) from the Mailbox, which commit to the Merkle root of all dispatched message IDs. 
        On the destination chain, Relayers will then call the process() function on the receiving Mailbox, which verifies the relayed message with the ISM module. 
        The Mailbox processing function will conclude the token transfer by calling the handle() function the destination token router contract, which will contain the logic for asset delivery to the user. 
        Depending on the application, this can be releasing tokens from an escrow, or minting new tokens previously burnt on the origin chain.`,
      references: [
        {
          text: 'Hyperlane documentation',
          href: 'https://docs.hyperlane.xyz/',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Validation via ISMs',
      description: '.',
      risks: [],
      references: [],
    },
    destinationToken: {
      name: 'Destination tokens',
      description: '.',
      references: [],
      risks: [],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Mailbox',
        'The Mailbox contract is responsible for dispatching and processing messages between the chains.',
      ),
      discovery.getContractDetails(
        'StaticAggregationIsm',
        'The Interchain Security Model (ISM) contract defines the security model for the bridge, unless overridden by a custom ISM.',
      ),
    ],
    risks: [],
  },
  permissions: [],
  knowledgeNuggets: [],
}
