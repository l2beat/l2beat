import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { Layer2 } from './types'
import { subtractOne } from '../common/assessCount'
import { addSentimentToDataAvailability } from '../common'
import { orbitStackL2 } from './templates/orbitStack'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('kinto')

export const kinto: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Kinto',
    slug: 'kinto',
    headerWarning: '',
    description:
      'Kinto is an Optimium with account abstraction and KYC enabled for all users, that supports both modern financial institutions and decentralized protocols.',
    purposes: ['DeFi'],
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
        'Escrow for yielding assets that are then bridged in batches.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.kinto-rpc.com',
    assessCount: subtractOne,
    startBlock: 1,
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ExecutorMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    {
      name: 'RollupOwner',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description: 'EOA that can execute upgrades via the UpgradeExecutor.',
    },
  ],
  milestones: [
    {
      name: 'Big Event',
      link: 'https://twitter.com/ParallelFi/status/1743048283684237574',
      date: '2024-01-05T00:00:00Z',
      description: 'Parallel Mainnet is open for developers.',
    },
  ],
})
