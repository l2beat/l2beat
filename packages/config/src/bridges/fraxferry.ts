import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../common'
import { Bridge } from './types'

// const discovery = new ProjectDiscovery('fraxferry')

export const fraxferry: Bridge = {
  type: 'bridge',
  id: ProjectId('fraxferry'),
  display: {
    name: 'Frax Ferry',
    slug: 'fraxferry',
    links: {
      websites: ['https://frax.com/'],
      explorers: [],
      apps: ['https://mainnet.frax.com/tools/bridge/'],
      repositories: ['https://github.com/FraxFinance/frax-solidity'],
      socialMedia: ['https://twitter.com/fraxfinance'],
    },
    description:
      'The Frax Ferry is a permissioned bridge that can be used to transfer tokens between chains.',
    category: 'Token Bridge',
  },
  config: {
    associatedTokens: ['FRAX', 'FXS', 'frxETH', 'sfrxETH'],
    escrows: [
      {
        address: EthereumAddress('0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE'),
        sinceTimestamp: new UnixTime(0),
        tokens: ['FRAX'],
      },
      {
        address: EthereumAddress('0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6'),
        sinceTimestamp: new UnixTime(0),
        tokens: ['FXS'],
      },
      {
        address: EthereumAddress('0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3'),
        sinceTimestamp: new UnixTime(0),
        tokens: ['sfrxETH'],
      },
        {
          address: EthereumAddress('0x9A576A3d39c589A861B46864C253288bcA428a6c'),
          sinceTimestamp: new UnixTime(0),
          tokens: ['FPI'],
        },
        {
          address: EthereumAddress('0x958815f476cD07354c0BC034EE5077B20fD93003'),
          sinceTimestamp: new UnixTime(0),
          tokens: ['FPIS'],
        },
        {
          address: EthereumAddress('0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47'),
          sinceTimestamp: new UnixTime(0),
          tokens: ['sFRAX'],
        },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Transfers out of the bridge are validated by...',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: `Admin Multisig can move all funds out of the bridge via admin functions with no warning.`,
      sentiment: 'bad',
    },
  },
  technology: {
    canonical: true,
    destination: [
      'Arbitrum',
      'Optimism',
      'Fraxtal',
      'Boba',
      'Polygon zkEVM',
      'zkSync',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: '...',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Both inbound and outbound transfers are verified by',
      description: '...',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'incorrect hash is submitted and nobody challenges it.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'bridge administrator removes funds from the bridge escrow.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
    destinationToken: {
      name: 'Destination tokens are not verified',
      description: '...',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  contracts: {
    addresses: [],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [],
}
