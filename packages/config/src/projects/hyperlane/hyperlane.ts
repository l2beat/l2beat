import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const PROJECT_ID = ProjectId('hyperlane')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())
const multisigIsmThresholdString =
  discovery.getContractValue<string>(
    'StaticMessageIdMultisigIsm',
    'threshold',
  ) +
  ' / ' +
  discovery
    .getContractValue<string[]>('StaticMessageIdMultisigIsm', 'validators')
    .length.toString()

export const hyperlane: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  addedAt: UnixTime(1738918243), // 2025-02-07T
  display: {
    name: 'Hyperlane Nexus',
    slug: 'hyperlane',
    // nexus-unspecific fields are commented out (will add those later)
    // warning:
    //   'The security parameters of each Token Router and non-default ISM module must be individually assessed, and can be changed by their developers.',
    category: 'Token Bridge',
    links: {
      websites: ['https://hyperlane.xyz/'],
      bridges: ['https://nexus.hyperlane.xyz/'],
      repositories: ['https://github.com/hyperlane-xyz'],
      documentation: ['https://docs.hyperlane.xyz/'],
      explorers: ['https://explorer.hyperlane.xyz/'],
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
        address: ChainSpecificAddress(
          'eth:0xe1De9910fe71cC216490AC7FCF019e13a34481D7',
        ),
        tokens: ['USDC'],
      }),
      // not on CG
      // discovery.getEscrowDetails({
      //   description:
      //     'Escrow for apxETH that is bridged from Ethereum to Eclipse.',
      //   address: ChainSpecificAddress('eth:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c'),
      //   tokens: ['apxETH'],
      // }),
      discovery.getEscrowDetails({
        description:
          'Escrow for USDT that is bridged from Ethereum to Eclipse.',
        address: ChainSpecificAddress(
          'eth:0x647C621CEb36853Ef6A907E397Adf18568E70543',
        ),
        tokens: ['USDT'],
      }),
      discovery.getEscrowDetails({
        description:
          'Escrow for WBTC that is bridged from Ethereum to Eclipse.',
        address: ChainSpecificAddress(
          'eth:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A',
        ),
        tokens: ['WBTC'],
      }),
      // not on CG
      // discovery.getEscrowDetails({
      //   description:
      //     'Escrow for tETH that is bridged from Ethereum to Eclipse.',
      //   address: EthereumAddress('0xc2495f3183F043627CAECD56dAaa726e3B2D9c09'),
      //   tokens: ['tETH'],
      // }),
      discovery.getEscrowDetails({
        description:
          'Escrow for weETHs that is bridged from Ethereum to Eclipse.',
        address: ChainSpecificAddress(
          'eth:0xef899e92DA472E014bE795Ecce948308958E25A2',
        ),
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
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
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
      Hyperlane Nexus is a minimal Token Bridge, simply representing a certain configuration of token routers (escrows) and ISMs (verifiers) built on top of the modular Hyperlane messaging protocol. 
      The Hyperlane messaging protocol consists of three main components: A Mailbox contract on each chain, Interchain Security Modules (ISMs), and Relayers. 
      The Mailbox as the central Endpoint contract on each chain is used for dispatching (out) and processing (in) messages. ISM contracts define the security model (validation logic) for a given message. 
      Unless overridden with a custom ISM config by an application or token router, the default 'multisig' ISM, configured by Hyperlane, is used. It validates messages by verifying that a threshold of ${multisigIsmThresholdString} signatures from a set of validators is reached.
      Post-dispatch hooks on the origin chain allow for added customizability and can be verified with a synchronized ISM logic at the destination. Hyperlane security and hook configurations have chain-specific defaults but can be customized for each token route by the router owner.
      
      
      To initiate a token transfer via the Nexus bridge, users call the transferRemote() function of the Nexus bridge token router (e.g. a contract called HypERC20). Depending on the specific token router, users' tokens may be wrapped, burned, or locked.
      The function call eventually dispatches a message through origin chains Mailbox, emitting a Dispatch event. Off-chain agents, such as ISM validators and Relayers, monitor the origin's Mailbox contract and index each dispatched message. 
      Multisig ISM validators sign off on messages by regularly producing attestations (called checkpoints), which commit to the Merkle root of all dispatched message IDs from a Mailbox at a given origin. 
      On the destination chain, Relayers will then call the process() function on the receiving Mailbox, which verifies the relayed message with the ISM module, which is either the default Multisig ISM or an ISM configured by the destination contract owner.
      The Mailbox's process() function will conclude the token transfer by calling handle() at the destination token router contract, which will contain the logic for asset delivery to the user. 
      Depending on the application, this can be releasing tokens from an escrow, minting new tokens or other transactions.`,
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
        'Each crosschain transaction is emitted on the origin chain and must be picked up by relayers and verified by preconfigured verifiers (Hyperlane calls these ISMs). If they agree on a message, it is considered verified and can be executed at the destination.',
      references: [
        {
          title:
            'Etherscan: Function setInterchainSecurityModule() in HypERC20Collateral (token router)',
          url: 'https://etherscan.io/address/0xe8cc4ff9203196a90734d2c4328b83775486163c#code#F4#L73',
        },
        {
          title:
            'Etherscan: Function verify() in StaticMessageIdMultisigIsm (default Multisig ISM)',
          url: 'https://etherscan.io/address//0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e#code#F2#L71',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the required validators fail to sign the transfer message.',
        },
        {
          category: 'Funds can be lost if',
          text: 'the required validators fail to sign the transfer message and are not actively replaced by honest ones by the admin.',
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
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
