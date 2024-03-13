import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('fraxferry')

const challengePeriod = formatSeconds(
  discovery.getContractValue('fraxFerryBridge', 'MIN_WAIT_PERIOD_EXECUTE'),
)

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
    associatedTokens: [
      'FRAX',
      'FXS',
      'frxETH',
      'sfrxETH',
      'FPI',
      'FPIS',
      'sFRAX',
    ],
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
      value: 'Optimistic',
      description: `Transfers out of the bridge are considered valid if no challenge is submitted within the challenge period of ${challengePeriod}.`,
      sentiment: 'warning',
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
      description:
        'The Frax Ferry is a permissioned bridge that can be used to transfer tokens between chains. Users can transfer tokens to the bridge escrow on the origin chain, and the bridge administrator (Captain) periodically posts hashes of transaction batches on the destination chains. After the challenge period is expired, the batch is considered valid, and another permissioned account (First Officer) executes the transfer of the tokens on the destination chain.',
      references: [
        {
          text: 'Fraxferry documentation',
          href: 'https://docs.frax.com/fraxferry',
        },
        {
          text: 'Fraxferry contract',
          href: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L851',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Both inbound and outbound transfers are verified optimistically',
      description: `Hashes of transaction batches on the origin chains are posted periodically on the destination chains by the Frax Maintenance Bot EOA (the Captain). After the batch hash is posted on the destination chain, a challenge period begins. If no challenge is submitted within the challenge period of ${challengePeriod}, the batch is considered valid. The authorised bridge First Officer can then execute the transfer of the tokens on the destination chain. No slashing mechanism is implemented. During a challenge period, a batch can be challenged by a permissioned set of watchdogs, the Crew Members, by sending a transaction on the destination chain. Should a batch be disputed, the bridge is paused until it is unpaused by the bridge owner.`,
      references: [
        {
          text: 'Fraxferry - Depart transactions batch function',
          href: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L851',
        },
        {
          text: 'Fraxferry - Dispute Batch function',
          href: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L882',
        },
        {
          text: 'Fraxferry - Disembark Batch function',
          href: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L858',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'incorrect hash is submitted and nobody challenges it.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'bridge owner removes funds from the bridge escrow.',
          isCritical: true,
        },
      ],
    },
    destinationToken: {
        name: 'Destination tokens are not upgradable',
        description:
          'Tokens on the destination chain are not upgradable. The owner of the token contract sets permissioned Minter addresses that can mint tokens up to a max cap amount.',
        references: [
            {
                text: 'Frax token - Minter mint function',
                href: 'https://arbiscan.io/address/0x17fc002b466eec40dae837fc4be5c67993ddbd6f?a=0x5a9bef8cea603aac78a523fb245c1a9264d50706#code#L1636',
            },
        ],
        risks: [], // do we need a risk for arbitrary permissioned minting / dilution risk ?
      },
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE'),
        name: 'FRAX Ferry Bridge',
        description: 'FRAX Bridge Contract (Escrow).',
      },
      {
        address: EthereumAddress('0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6'),
        name: 'FXS Ferry Bridge',
        description: 'FRAX Bridge Contract (Escrow).',
      },
      {
        address: EthereumAddress('0x9A576A3d39c589A861B46864C253288bcA428a6c'),
        name: 'FPI Ferry Bridge',
        description: 'FPI Bridge Contract (Escrow).',
      },
      {
        address: EthereumAddress('0x958815f476cD07354c0BC034EE5077B20fD93003'),
        name: 'FPIS Ferry Bridge',
        description: 'FPIS Bridge Contract (Escrow).',
      },
      {
        address: EthereumAddress('0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3'),
        name: 'sfrxETH Ferry Bridge',
        description: 'sfrxETH Bridge Contract (Escrow).',
      },
      {
        address: EthereumAddress('0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47'),
        name: 'sFrax Ferry Bridge',
        description: 'sFRAX Bridge Contract (Escrow).',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Bridge Owner',
      description:
        'Address authorized to pause and unpause the bridge, remove posted batches, set the challenge period, and change the bridge captain, first officer and crew members. It is also allowed to set fees and transfer tokens from the bridge escrow.',
      accounts: [
        discovery.getPermissionedAccount('fraxFerryBridge', 'firstOfficer'),
      ],
    },
    {
      name: 'Captain',
      description:
        'Address authorized to post batch transaction data from the origin chain.',
      accounts: [
        discovery.getPermissionedAccount('fraxFerryBridge', 'captain'),
      ],
    },
    {
      name: 'First Officer',
      description:
        'Address authorized to distribute funds on the destination chain once the challenge period has passed.',
      accounts: [
        discovery.getPermissionedAccount('fraxFerryBridge', 'firstOfficer'),
      ],
    },
    {
      name: 'Crew Members',
      description:
        'Addresses authorized to dispute batch transaction data on the destination chain.',
      accounts: 
          discovery.getPermissionedAccounts(
            'fraxFerryBridge', 
            'crewmembers',
        ),
    },
  ],
}
