import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('galxegravity', 'ethereum')

export const galxegravity: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1719415787), // 2024-06-26T15:29:47Z
  discovery,
  badges: [Badge.DA.DAC, Badge.RaaS.Conduit],
  associatedTokens: ['G'],
  nativeToken: 'G',
  display: {
    name: 'Gravity',
    slug: 'galxegravity',
    description:
      'Gravity is an Optimium built on the Orbit stack. It features onchain questing and has its own gas token - G. Other Galxe products are aiming to integrate with the L2 and a future migration to an L1 of the same name is planned.',
    links: {
      websites: ['https://gravity.xyz'],
      apps: ['https://bridge.gravity.xyz/'],
      documentation: ['https://docs.gravity.xyz/'],
      explorers: ['https://gscan.xyz/', 'https://explorer.gravity.xyz/'],
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
  chainConfig: {
    name: 'galxegravity',
    chainId: 1625,
    explorerUrl: 'https://gscan.xyz/',
    explorerApi: {
      url: 'https://explorer.gravity.xyz/api',
      type: 'blockscout',
    },
    blockscoutV2ApiUrl: 'https://explorer.gravity.xyz/api/v2',
    minTimestampForTvl: new UnixTime(1716054191), // block 1 TS
    multicallContracts: [
      {
        sinceBlock: 52682,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
  },
  discoveryDrivenData: true,
})
