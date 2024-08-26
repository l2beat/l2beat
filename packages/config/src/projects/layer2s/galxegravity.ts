import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('galxegravity', 'ethereum')

export const galxegravity: Layer2 = orbitStackL2({
  discovery,
  badges: [Badge.DA.DAC, Badge.RaaS.Conduit],
  associatedTokens: ['G'],
  nativeToken: 'G',
  display: {
    name: 'Gravity Alpha',
    slug: 'galxegravity',
    description: 'Gravity is an Optimium built on the Orbit stack. It features onchain questing and has its own gas token - G. Once complete, Alpha Mainnet is supposed to get merged into Gravity Mainnet (a Proof-of-Stake Layer 1 blockchain).',
    purposes: ['Social'],
    links: {
      websites: ['https://gravity.xyz'],
      apps: [],
      documentation: ['https://docs.gravity.xyz/'],
      explorers: ['https://explorer.gravity.xyz/'],
      repositories: ['https://github.com/Galxe'],
      socialMedia: [
        'https://x.com/GravityChain',
        'https://discord.com/invite/GravityChain',
        'https://t.me/GravityChain',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://rpc.gravity.xyz',
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.gravity.xyz',
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
    startBlock: 1,
  },
  nonTemplatePermissions: [
    {
      name: 'Conduit Multisig',
      accounts: [
        {
          address: discovery.getAccessControlField(
            'UpgradeExecutor',
            'EXECUTOR_ROLE',
          ).members[0],
          type: 'MultiSig',
        },
      ],
      description:
        "MultiSig that can upgrade the rollup's smart contract system (via UpgradeExecutor) and gain access to all funds.",
    },
  ],
})
