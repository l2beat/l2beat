import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Bridge } from '.'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('eclipse')

export const eclipse: Bridge = {
  type: 'bridge',
  id: ProjectId('eclipse'),
  createdAt: new UnixTime(1725359142), // 2024-09-03T10:25:42Z
  display: {
    name: 'Eclipse',
    slug: 'eclipse',
    description:
      'Eclipse is a sidechain powered by the Solana Virtual Machine (SVM).',
    category: 'Token Bridge',
    links: {
      websites: ['https://eclipse.xyz/'],
      apps: [],
      documentation: ['https://docs.eclipse.xyz/'],
      explorers: ['https://explorer.eclipse.xyz/'],
      repositories: ['https://github.com/Eclipse-Laboratories-Inc'],
      socialMedia: [
        'https://twitter.com/eclipsefnd',
        'https://discord.gg/eclipse-labs',
        'https://mirror.xyz/eclipsemainnet.eth',
      ],
    },
  },
  // rpcUrl: 'https://mainnetbeta-rpc.eclipse.xyz', custom VM, i guess it's different
  config: {
    escrows: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0xd7e4b67e735733ac98a88f13d087d8aac670e644'),
        sinceTimestamp: new UnixTime(1722140987),
        tokens: ['ETH'],
      },
    ],
  },
  technology: {
    destination: ['Eclipse'],
    principleOfOperation: {
      name: 'Principle of Operation',
      description:
        'Eclipse implements a custom deposit-only bridge. There is no functionality to withdraw assets back to Ethereum.',
      references: [
        {
          text: 'EtherBridge.sol - Etherscan source code, deposit() function, no withdraw function',
          href: 'https://etherscan.io/address/0x338017e0f208b4eaf8cd4bbdc8bdabefd0e39be9#code',
        },
        {
          text: 'Mailbox.sol - Etherscan source code, receiveMessage() function calls EtherBridge',
          href: 'https://etherscan.io/address/0x4cef0fa54dc06ce0ea198dab2f57d28a9dee712b#code',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Third party validation',
      description:
        'Deposits are processed by the bridge operators on the Eclipse side. There is no mechanism to send messages back to Ethereum.',
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the bridge operators decide not to mint tokens after observing a deposit.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the Treasury owner decides to transfer the funds locked on L1.',
        },
      ],
      references: [
        {
          text: 'Treasury.sol - Etherscan source code, emergencyWithdraw() function',
          href: 'https://etherscan.io/address/0xa8e15d2b1bf6b0fd3bc9ead06323c0730b67f8d4#code',
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Centralized operators control the bridge.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Contracts are instantly upgradable.',
      sentiment: 'bad',
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('EtherBridge', {
        description:
          'Entry point to deposit ETH. It is registered as a module in the Mailbox contract.',
      }),
      discovery.getContractDetails('Mailbox', {
        description:
          'Contract receiving messages from registered modules to send to Eclipse. It doesn’t have any functionality to send messages back to Ethereum.',
      }),
      discovery.getContractDetails('Treasury', {
        description: 'Holds the funds locked on Ethereum.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AuthorityMultisig',
      'Can pause and upgrade the EtherBridge and Mailbox contracts.',
    ),
    ...discovery.getMultisigPermission(
      'TreasuryOwner',
      'Can upgrade and transfer funds from the Treasury.',
    ),
  ],
}
