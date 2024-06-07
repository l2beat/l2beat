import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('mxc', 'arbitrum')
const discovery_ethereum = new ProjectDiscovery('mxc', 'ethereum')

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
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds. The system contracts are unverified.',
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
        ...discovery_ethereum.getEscrowDetails({
          address: EthereumAddress(
            '0x7C954170305b11572522313b6AD514070ce0339c',
          ),
          tokens: ['MXC'],
          description:
            'MXC tokens that are bridged from Ethereum to MXC Moonchain are escrowed here.',
        }),
      },
      {
        includeInTotal: false,
        chain: 'arbitrum',
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0xC31a6C0C1087BBB6E6660F27014aD1321591c641',
          ),
          tokens: '*',
          description:
            'Tokens that are bridged from Arbitrum to MXC Moonchain are escrowed here.',
        }),
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
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    sourceUpgradeability: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    destinationToken: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    stateValidation: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    dataAvailability: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    exitWindow: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    sequencerFailure: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    proposerFailure: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
  },
  technology: {},
  permissions: [
    {
      name: 'MXC deployer EOA',
      accounts: [discovery.getPermissionedAccount('SignalService', 'owner')],
      description:
        'Deployer of the MXC contracts. Upgrade admin of the MXC Moonchain escrow on Ethereum. Can potentially steal all funds. Owner of SignalService and potentially others.',
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
        'Upgrade admin of the MXC Moonchain escrow on Arbitrum. Can potentially steal all funds.',
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
