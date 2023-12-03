import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const pheasantNetwork: Bridge = {
  type: 'bridge',
  id: ProjectId('pheasantNetwork'),
  display: {
    name: 'PheasantNetwork',
    slug: 'pheasantNetwork',
    category: 'Hybrid',
    links: {
      apps: ['https://pheasant.network/'],
      documentation: ['https://docs.pheasant.network/'],
      repositories: ['https://github.com/Pheasant-Network/contracts'],
      socialMedia: [
        'https://twitter.com/PheasantNetwork',
        'https://discord.gg/pRYSEUVERT',
        'https://www.youtube.com/@PheasantNetwork',
      ],
    },
    description:
      'Pheasant Network is an optimistic bridge specialized for Layer 2.',
  },
  config: {
    // Relayer address
    escrows: [
      {
        address: EthereumAddress('0x1650683e50e075EFC778Be4D1A6bE929F3831719'),
        sinceTimestamp: new UnixTime(1671116400),
        tokens: ['ETH'],
      },
    ],
  },
  technology: {
    destination: [
      'Polygon', 'Optimism', 'Arbitrum', 'Scroll', 'zkSync Era', 'Base', 'Polygon zkEVM', 'Linea', 'Mode'
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Pheasant network is a optimistic bridge which brides asset without verifying the transaction on source chain. We chose different mechanism between "L2 > L1 and L2 > L2" and "L1 > L2" in order to make user experience better. Please see the docs for more details.',
      references: [
        {
          text: 'Network Participants',
          href: 'https://docs.pheasant.network/protocol/network-participants'
        },
        {
          text: 'L2 > L1 and L2 > L2',
          href: 'https://docs.pheasant.network/protocol/layer2-layer1'
        },
        {
          text: 'L1 > L2',
          href: 'https://docs.pheasant.network/protocol/layer1-layer2'
        }
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'If the relayer fails to send the assets back and no one is aware of the fraud, the assets could be stolen.',
          isCritical: false,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Users can be censored if',
          text: 'At this time the core team can disable the contract or stop the entire service.',
          isCritical: false,
          _ignoreTextFormatting: true,
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description:
        'User send their deposit to smart contract or relayer, then relayer bridge their asset. User will slash the bond if relayer behave maliciously',
      sentiment: 'warning',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x1650683e50e075EFC778Be4D1A6bE929F3831719',
          ),
          type: 'EOA',
        },
      ],
      name: 'Pheasant Network Relayer',
      description: 'Pheasant Network Relayer account for ETH bridge between supported network. ',
    }
  ],
  knowledgeNuggets: [],
}
