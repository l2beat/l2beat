import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('portal')

export const portal: Bridge = {
  type: 'bridge',
  id: ProjectId('portal'),
  display: {
    name: 'Portal (Wormhole)',
    slug: 'portal',
    links: {
      websites: ['https://wormhole.com/', 'https://linktr.ee/wormholecrypto'],
      documentation: ['https://docs.wormhole.com/'],
      explorers: ['https://wormhole.com/explorer/'],
      apps: ['https://portalbridge.com'],
      repositories: ['https://github.com/wormhole-foundation/wormhole'],
      socialMedia: [
        'https://discord.gg/wormholecrypto',
        'https://t.me/wormholecrypto',
        'https://twitter.com/wormholecrypto',
      ],
    },
    description:
      'Portal Token Bridge is built on top of Wormhole, which is a message passing protocol that performs cross-chain communication.',
    detailedDescription:
      'It leverages specialized network of nodes called Guardians to do this. It is governed by the same set of Guardians that run the underlying Wormhole protocols.',
    category: 'Token Bridge',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x3ee18B2214AFF97000D974cf647E7C347E8fa585'), // Escrows to various chains
        sinceTimestamp: new UnixTime(1631535967),
        tokens: [
          'WETH',
          //'NEXM',
          'XCN',
          'USDT',
          'USDC',
          'HUSD',
          'BUSD',
          'LINK',
          'SRM',
          'SUSHI',
          'UNI',
          'LDO',
          'DAI',
          'stETH',
        ],
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
        'This is a Token Bridge that locks tokens in the escrow contracts on Ethereum and mints tokens on the destination network. What differentiates this solution is the cross-chain message passing via the Wormhole protocol, in which emitted messages on one chain are observed by a network of nodes and then verified. After verification, this message is submitted to the destination chain for processing.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Validation process takes place in external network called the Guardian Network. Nodes in the network, called Guardians, observe the Core Contract on each supported chain and produce VAAs (Verified Action Approvals, essentially signed messages) when those contracts receive an interaction. Based on the VAA user can withdraw funds on the other end of the bridge.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'guardians decide to stop processing certain transactions.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'guardians allow to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'guardians sign a fraudulent message allowing themselves to withdraw all locked funds.',
          isCritical: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Type of the token received on the destination chain depends on the token, if it is native to this chain user will receive canonical token. If the bridged token is not native to the destination chain then user will end up with wrapped version, the contract is called BridgeToken and is upgradable.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
          isCritical: true,
        },
      ],
    },
  },

  contracts: {
    isIncomplete: true,
    addresses: [
      discovery.getContractDetails(
        'Wormhole',
        'Governance contract storing current Guardian set and provides a facility to verify a cross-chain message by verifying Guardians signatures. \
        Guardians themselves can choose a new Guardian set. Can be upgraded by Guardians.',
      ),
      discovery.getContractDetails(
        'TokenBridge',
        'Main bridge contract and an escrow for ETH and ERC20 tokens using Wormhole AMB to bridge tokens to different chains. Can be upgraded by Guardians.',
      ),
      discovery.getContractDetails(
        'TokenImplementation',
        'A wormhole IOU token.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },

  permissions: [
    {
      name: 'Guardian Network',
      description:
        'Off-chain actors signing messages (VAA) containing transfer information or governance actions such as upgrade, which are decoded on chain with signatures check.',
      accounts: discovery.getPermissionedAccounts('Wormhole', 'guardianSet', 0),
    },
  ],
  milestones: [
    {
      name: 'Contracts hacked for $326M',
      date: '2022-02-03T00:00:00.00Z',
      link: 'https://rekt.news/wormhole-rekt/',
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
