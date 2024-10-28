import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('portal')

export const portal: Bridge = {
  type: 'bridge',
  id: ProjectId('portal'),
  createdAt: new UnixTime(1665415357), // 2022-10-10T15:22:37Z
  display: {
    name: 'Portal (Wormhole)',
    slug: 'portal',
    links: {
      websites: ['https://wormhole.com/'],
      documentation: [
        'https://portalbridge.com/docs/',
        'https://docs.wormhole.com/wormhole',
      ],
      explorers: ['https://wormholescan.io/'],
      apps: ['https://portalbridge.com'],
      repositories: ['https://github.com/wormhole-foundation/wormhole'],
      socialMedia: [
        'https://discord.gg/wormholecrypto',
        'https://t.me/wormholecrypto',
        'https://x.com/wormhole',
        'https://youtube.com/@wormholecrypto',
      ],
    },
    description:
      'Portal Token Bridge is built on top of Wormhole, which is a message passing protocol that performs cross-chain communication.',
    detailedDescription:
      'It leverages a specialized network of nodes called Guardians to do this. It is governed by the same set of Guardians that run the underlying Wormhole protocols.',
    category: 'Token Bridge',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x3ee18B2214AFF97000D974cf647E7C347E8fa585'), // Escrows to various chains
        sinceTimestamp: new UnixTime(1631535967),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be signed offchain by a set of 2/3 of Guardians and then relayed to the destination chain.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL_OR_WRAPPED,
  },
  technology: {
    destination: [
      'Acala',
      'Algorand',
      'Aurora',
      'Avalanche',
      'Binance Smart Chain',
      'Celo',
      'Ethereum',
      'Fantom',
      'Karura',
      'Klaytn',
      'Moonbeam',
      'Near',
      'Oasis',
      'Polygon',
    ],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a type of Token Bridge that locks tokens in the escrow contracts on the source chain and mints tokens at the destination. What differentiates this solution is the cross-chain message passing via the Wormhole protocol, in which emitted messages on one chain are observed by a network of nodes and then verified. After verification, this message is submitted to the destination chain for processing.',
      references: [
        {
          text: 'Docs: Wormhole architecture',
          href: 'https://docs.wormhole.com/wormhole/explore-wormhole/components',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Validation process takes place in an external network called the Guardian Network. Nodes in the network, called Guardians, observe the Core Contract on each supported chain and produce VAAs (Verified Action Approvals, essentially signed messages) when those contracts receive an interaction. Based on the VAA users can withdraw funds on the other end of the bridge.',
      references: [
        {
          text: 'WormholeCore contract: function verifyVM()',
          href: 'https://etherscan.io/address/0x3c3d457f1522d3540ab3325aa5f1864e34cba9d0#code#F9#L28',
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
        'The type of token received on the destination chain depends on the token, if it is native to this chain, the user will receive the canonical token. If the bridged token is not native to the destination chain the user will receive a wrapped version. The token contract in this case is called BridgeToken and is upgradable.',
      references: [
        {
          text: 'BridgeToken contract implementation',
          href: 'https://etherscan.io/address/0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6#code',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
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
        'Off-chain actors signing messages (VAA) containing transfer information or governance actions such as upgrades, which are decoded on chain with signature checks.',
      accounts: discovery.getPermissionedAccounts(
        'WormholeCore',
        'guardianSet',
        0,
      ),
    },
  ],
  milestones: [
    {
      name: 'Contracts hacked for $326M',
      date: '2022-02-03T00:00:00.00Z',
      link: 'https://rekt.news/wormhole-rekt/',
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
