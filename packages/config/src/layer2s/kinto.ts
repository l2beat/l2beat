import { EthereumAddress } from '@l2beat/shared-pure'

import { subtractOne } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('kinto')

export const kinto: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Kinto',
    slug: 'kinto',
    headerWarning: '',
    description:
      'Kinto is an Orbit stack L2 with account abstraction and KYC enabled for all users, supporting both modern financial institutions and decentralized protocols.',
    purposes: ['Universal', 'DeFi'],
    links: {
      websites: ['https://kinto.xyz'],
      apps: ['https://engen.kinto.xyz/engen-setup'],
      documentation: ['https://docs.kinto.xyz'],
      explorers: ['https://explorer.kinto.xyz/', 'https://searchkinto.com/'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/kintoxyz',
        'https://discord.gg/utEYFxKFgB',
        'https://mirror.xyz/kintoxyz.eth',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x0f1b7bd7762662b23486320aa91f30312184f70c'),
      tokens: '*',
      description:
        "Bridger escrow that swaps deposited assets to 'L2 final assets' that are later bridged to the L2 in batches.",
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x7870D5398DB488c669B406fBE57b8d05b6A35e42'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  isNodeAvailable: false,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.kinto-rpc.com',
    defaultCallsPerMinute: 600,
    assessCount: subtractOne,
    startBlock: 1,
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ExecutorMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    ...discovery.getMultisigPermission(
      'BridgerOwnerMultisig',
      'Multisig that can upgrade the Engen escrow.',
    ),
    {
      name: 'Bridger Sender Account',
      description:
        'EOA privileged to call `bridgeDeposits()` on the Bridger L1 escrow to send escrowed funds to the L2. It can also deposit tokens into the escrow itself by submitting signatures.',
      accounts: [discovery.getPermissionedAccount('Bridger', 'senderAccount')],
    },
  ],
  milestones: [
    // {
    //   name: 'Mainnet final launch',
    //   link: 'https://medium.com/mamori-finance/%EF%B8%8F-engen-update-numbers-rewards-00f96370ceac',
    //   date: '2024-05-16T00:00:00Z',
    //   description: 'Engen mining is completed and locked funds are deposited to the Kinto L2. Users can deposit and withdraw funds.',
    // },
    {
      name: 'Kinto Mainnet Genesis',
      link: 'https://medium.com/mamori-finance/%EF%B8%8F-kintos-launch-the-set-up-7eddfbb4bc38',
      date: '2023-12-15T00:00:00Z',
      description: 'Kinto mainnet is launched. Deposits by users are disabled.',
    },
  ],
})
