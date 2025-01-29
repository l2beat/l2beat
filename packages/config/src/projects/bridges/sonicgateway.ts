import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import type { Bridge } from './types'

const discovery = new ProjectDiscovery('sonicgateway')

export const sonicgateway: Bridge = {
  type: 'bridge',
  id: ProjectId('sonicgateway'),
  createdAt: new UnixTime(1738059875), // 2025-01-28T10:24:35+00:00
  display: {
    name: 'Sonic Gateway',
    slug: 'sonicgateway',
    links: {
      websites: ['https://gateway.soniclabs.com/'],
      documentation: ['https://docs.soniclabs.com/sonic/sonic-gateway'],
      explorers: [],
      apps: ['https://gateway.soniclabs.com/ethereum/sonic/s'],
      repositories: [],
      socialMedia: [
        'https://x.com/SonicLabs',
        'https://t.me/SonicAnnouncements',
        'https://discord.gg/3Ynr2QDSnB',
        'https://reddit.com/r/0xSonic/',
      ],
    },
    description:
      'The Sonic Gateway is a token bridge built for token transfers between Ethereum and Sonic. It has a quasi-symmetrical design for two-way bridging but converts Ethereum-locked FTM into S on Sonic.',
    category: 'Token Bridge',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20'),
        tokens: [
          'FTM',
          'USDT',
          'USDC',
          'EURC',
          'WETH',
          'DOLA',
          'SILO',
          'UNI',
          'CRV',
        ],
        description:
          'This is the central escrow that locks tokens on the Ethereum side of the Sonic Gateway.',
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be signed by a threshold of 6/8 Validators and then relayed to the destination chain.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Sonic'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a type of Token Bridge that locks tokens in the escrow contracts on the source chain and mints tokens at the destination. What differentiates this solution is that the cross-chain message is sent via the Wormhole protocol, in which emitted messages on one chain are observed by a network of nodes (Wormhole: Guardians) and then verified. After its verification, the message is submitted to the destination chain for processing. Since the Guardian network is essential to the security of the Wormhole protocol, Guardians can tap into additional sources of truth apart from the events emitted at the source chain. The Wormhole Gateway, a Cosmos-SDK chain, serves as a hub that can perform additional standardized checks on metadata like VAA format and global token balances and flows.',
      references: [
        {
          title: 'Docs: Wormhole architecture',
          url: 'https://docs.wormhole.com/wormhole/explore-wormhole/components',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Validation process takes place in an external network called the Guardian Network. Nodes in the network, called Guardians, observe the Core Contract on each supported chain and produce VAAs (Verified Action Approvals, essentially signed messages) when those contracts receive an interaction. Based on a threshold of VAAs, users can withdraw funds on the other end of the bridge.',
      references: [
        {
          title: 'WormholeCore contract: function verifyVM()',
          url: 'https://etherscan.io/address/0x3c3d457f1522d3540ab3325aa5f1864e34cba9d0#code#F9#L28',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'guardians decide to stop processing certain transactions.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'guardians allow to mint more tokens than there are locked on Ethereum, preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'guardians sign a fraudulent message allowing themselves to withdraw all locked funds.',
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'The type of token received on the destination chain depends on the token: If it is native to this chain, the user will receive the canonical token. If the bridged token is not native to the destination chain the user will receive a wrapped version. The token contract in this case is called BridgeToken and is upgradable.',
      references: [
        {
          title: 'BridgeToken contract implementation',
          url: 'https://etherscan.io/address/0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6#code',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the destination token contract is maliciously upgraded.',
        },
      ],
    },
  },

  contracts: {
    addresses: [
      discovery.getContractDetails(
        'WormholeCore',
        'Governance contract storing the current Guardian set and providing a facility to verify cross-chain messages by verifying Guardians signatures. \
           Guardians themselves can choose a new Guardian set. Can be upgraded by Guardians.',
      ),
      discovery.getContractDetails(
        'TokenBridge',
        'Main bridge contract on Ethereum and an escrow for ETH and ERC20 tokens that were bridged to other chains. Can be upgraded by Guardians.',
      ),
      discovery.getContractDetails(
        'TokenImplementation',
        'This is the template for BridgedToken implementations minted by Portal on Ethereum.',
      ),
      discovery.getContractDetails(
        'NFTBridge',
        'NFT bridge contract and an escrow for NFTs that were bridged to other chains. Can be upgraded by Guardians.',
      ),
      discovery.getContractDetails(
        'NFTImplementation',
        'This is the template for bridged NFTs minted by Portal on Ethereum.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },

  permissions: [
    {
      name: 'Guardian Network',
      description:
        'Off-chain actors signing messages (VAAs) containing transfer information or governance actions such as upgrades, which are decoded onchain with signature checks.',
      accounts: discovery.getPermissionedAccounts(
        'WormholeCore',
        'guardianSet',
        0,
      ),
    },
  ],
  milestones: [
    {
      title: 'Wormhole introduces NTT for $W',
      date: '2024-04-25T00:00:00.00Z',
      url: 'https://wormhole.com/docs/learn/messaging/native-token-transfers/overview/',
      description:
        'Native Token Transfers (NTT) is a multichain composable token standard developed by Wormhole.',
      type: 'general',
    },
    {
      title: 'Contracts hacked for $326M',
      date: '2022-02-03T00:00:00.00Z',
      url: 'https://rekt.news/wormhole-rekt/',
      type: 'incident',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Wormhole core architecture',
      url: 'https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0001_generic_message_passing.md',
    },
    {
      title: 'How Wormhole Guardians work',
      url: 'https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0009_guardian_key.md',
    },
  ],
}
