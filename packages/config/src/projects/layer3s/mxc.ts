import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('mxc', 'arbitrum')

// Rollup contracts on Arbitrum are not verified
// RollupAddressManager: https://arbiscan.io/address/0x931a8ffccda64dc441bcca81bd65dc0c3d42af74
//   deployer on arbitrum: https://arbiscan.io/txs?a=0xC6D7522f7B012b22Bc365C9C43b3DBf13B9aAfF9

export const mxc: Layer3 = {
  id: ProjectId('mxc'),
  type: 'layer3',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'MXC Moonchain zkEVM',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    shortName: 'MXC',
    slug: 'mxc',
    provider: 'Taiko',
    description:
      'The MXC Moonchain zkEVM is an IoT-centric zk-rollup solution on Arbitrum based on Taiko zkEVM. It offers type-1 EVM equivalence, ensuring opcode-level compatibility with the Ethereum Virtual Machine.',
    purposes: ['Universal', 'IoT'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://mxc.org/'],
      apps: [
        'https://erc20.moonchain.com/',
        'https://bridge.mxc.com/',
        'https://mxc.org/axs-app',
      ],
      documentation: ['https://doc.mxc.com'],
      explorers: ['https://explorer.moonchain.com'],
      repositories: ['https://github.com/MXCzkEVM'],
      socialMedia: [
        'https://x.com/mxcfoundation',
        'https://discord.com/invite/mxcfoundation',
        'https://t.me/mxcfoundation',
        'https://linkedin.com/company/mxc-foundation/',
        'https://facebook.com/MXCfoundation/',
        'https://youtube.com/c/MXCFoundation',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0x7C954170305b11572522313b6AD514070ce0339c'),
        sinceTimestamp: new UnixTime(1689164375),
        tokens: ['MXC'],
      },
      {
        includeInTotal: false,
        chain: 'arbitrum',
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0xC31a6C0C1087BBB6E6660F27014aD1321591c641',
          ),
          tokens: '*',
        }),
      },
      {
        includeInTotal: false,
        chain: 'arbitrum',
        address: EthereumAddress('0xC31a6C0C1087BBB6E6660F27014aD1321591c641'),
        sinceTimestamp: new UnixTime(1689143164),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc.mxc.com',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
    },
  },
  riskView: {
    validatedBy: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    sourceUpgradeability: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    destinationToken: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    stateValidation: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    dataAvailability: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    exitWindow: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    sequencerFailure: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    proposerFailure: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
  },
  technology: {
    dataAvailability: {
      name: '',
      description: '',
      references: [],
      risks: [],
    },
    operator: {
      name: '',
      description: '',
      references: [],
      risks: [],
    },
    forceTransactions: {
      name: '',
      description: '',
      references: [],
      risks: [],
    },
    exitMechanisms: [],
  },
  permissions: [
    {
      name: 'MXC deployer EOA',
      accounts: [discovery.getPermissionedAccount('SignalService', 'owner')],
      description:
        'Deployer of the MXC contracts. Owner of SignalService and potentially others.',
    },
    {
      name: 'Vault Admin EOA',
      accounts: [
        {
          address: discovery.getContractUpgradeabilityParam(
            'TokenVault?',
            'admin',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Upgrade admin of the MXC escrows on Ethereum and Arbitrum. Can potentially steal all funds.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('MxcL1Contract?'),
      discovery.getContractDetails('AddressManager?'),
      discovery.getContractDetails('SignalService'),
      discovery.getContractDetails('Bridge?'),
      discovery.getContractDetails('TokenVault?'),
    ],
    risks: [],
  },
}
