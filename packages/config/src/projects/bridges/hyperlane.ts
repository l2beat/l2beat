import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'
import { RISK_VIEW } from './common'

const PROJECT_ID = ProjectId('hyperlane')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())

export const hyperlane: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  addedAt: new UnixTime(1738918243), // 2025-02-07T
  display: {
    name: 'Hyperlane Nexus',
    slug: 'hyperlane',
    // nexus-unspecific fields are commented out (will add those later)
    // warning:
    //   'The security parameters of each Token Router and non-default ISM module must be individually assessed, and can be changed by their developers.',
    category: 'Token Bridge',
    links: {
      websites: ['https://hyperlane.xyz/'],
      apps: ['https://usenexus.org/'],
      repositories: ['https://github.com/hyperlane-xyz'],
      documentation: ['https://docs.hyperlane.xyz/'],
      socialMedia: [
        'https://x.com/hyperlane',
        'https://discord.com/invite/VK9ZUy3aTV',
      ],
    },
    description:
      'Hyperlane Nexus is a Token Bridge built on the Hyperlane interoperability protocol for cross-chain communication. The Nexus bridge validates token bridging between chains with Multisig threshold security by default, whereas the Hyperlane protocol supports a wide range of endpoint and security configurations.',
    // detailedDescription: `It allows developers to create interchain token bridges by deploying Hyperlane Warp Route contracts and leveraging the Hyperlane Mailbox infrastructure deployed to each chain.
    //     Hyperlane deployments can be configured with a custom Interchain Security Module (ISM), which specifies the security model to use. If no custom ISM is configured, the default ISM module will be used.`,
  },
  config: {
    escrows: [
      // to eclipse
      discovery.getEscrowDetails({
        description:
          'Escrow for USDC that is bridged from Ethereum to Eclipse.',
        address: EthereumAddress('0xe1De9910fe71cC216490AC7FCF019e13a34481D7'),
        tokens: ['USDC'],
      }),
      // not on CG
      // discovery.getEscrowDetails({
      //   description:
      //     'Escrow for apxETH that is bridged from Ethereum to Eclipse.',
      //   address: EthereumAddress('0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c'),
      //   tokens: ['apxETH'],
      // }),
      discovery.getEscrowDetails({
        description:
          'Escrow for USDT that is bridged from Ethereum to Eclipse.',
        address: EthereumAddress('0x647C621CEb36853Ef6A907E397Adf18568E70543'),
        tokens: ['USDT'],
      }),
      discovery.getEscrowDetails({
        description:
          'Escrow for WBTC that is bridged from Ethereum to Eclipse.',
        address: EthereumAddress('0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A'),
        tokens: ['WBTC'],
      }),
      discovery.getEscrowDetails({
        description:
          'Escrow for tETH that is bridged from Ethereum to Eclipse (escrows the underlying tokens).',
        address: EthereumAddress('0x19e099B7aEd41FA52718D780dDA74678113C0b32'),
        tokens: ['rswETH', 'weETH', 'pufETH', 'ezETH', 'WETH'],
      }),
      discovery.getEscrowDetails({
        description:
          'Escrow for weETHs that is bridged from Ethereum to Eclipse.',
        address: EthereumAddress('0xef899e92DA472E014bE795Ecce948308958E25A2'),
        tokens: ['weETHs'],
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'The Hyperlane message protocol is used. If the verifier (called ISM, default is a multisig) agrees on a message, it is considered verified and can be executed at the destination.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'System and token contracts can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
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
      description: `
      Hyperlane Nexus is a minimal Token Bridge, simply representing a certain configuration of the modular Hyperlane protocol. 
      It consists of three main components: A Mailbox contract on each chain, Interchain Security Modules (ISMs), and Relayers. 
      The Mailbox as the central Endpoint contract on each chain, befitting to its name, is used for dispatching and processing messages. The ISM contract defines the security model (validation logic) for a given message. 
      Unless overridden with a custom ISM by an application, the default multisig ISM is used. The default ISM validates messages by verifying that a quorum of signatures from a set of configured validators is reached (similar to a Multisig).
      
      
      The Nexus bridge
      To initiate a token transfer, users call the transferRemote() function of the Nexus bridge token router (e.g. a contract called HypERC20). Depending on the specific token router, users' tokens may be wrapped, burned, or locked.
      The function call eventually dispatches a message to the origin chain Mailbox, emitting a Dispatch event. Off-chain agents, such as ISM validators and Relayers, monitor the Mailbox contract events and index each dispatched message. 
      ISM validators sign off on messages by producing attestations (called checkpoints) from the Mailbox, which commit to the Merkle root of all dispatched message IDs. 
      On the destination chain, Relayers will then call the process() function on the receiving Mailbox, which verifies the relayed message with the ISM module. 
      The Mailbox processing function will conclude the token transfer by calling the handle() function the destination token router contract, which will contain the logic for asset delivery to the user. 
      Depending on the application, this can be releasing tokens from an escrow, or minting new tokens previously burnt on the origin chain.`,
      references: [
        {
          title: 'Hyperlane documentation',
          url: 'https://docs.hyperlane.xyz/',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Modular ISMs',
      description:
        'Each crosschain transaction is emitted on the origin chain and must be picked up and verified by preconfigured verifiers (Hyperlane calls these ISMs). If they agree on a message, it is considered verified and can be executed at the destination.',
      references: [
        {
          title:
            'Etherscan: Function setInterchainSecurityModule() in HypERC20Collateral (token router)',
          url: 'https://etherscan.io/address/0xe8cc4ff9203196a90734d2c4328b83775486163c#code#F4#L73',
        },
        {
          title:
            'Etherscan: Function verify() in StaticAggregationIsm (token router)',
          url: 'https://etherscan.io/address//0xd27fe5631533a193776A61B600809a73256eF9a7#code#F2#L48',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the required verifiers fail to sign the transfer message.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'there is no custom ISM configured and the default ISM Multisig signers submit a fraudulent transfer message.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the token router owner changes the token router or its security stack (ISM) maliciously.',
        },
      ],
    },
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails(
          'Mailbox',
          'The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.',
        ),
        discovery.getContractDetails(
          'StaticAggregationIsm',
          'This specific Interchain Security Model (ISM) contract defines the security model for the nexus bridge, unless overridden by a custom ISM.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
