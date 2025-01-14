import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('soneium')

export const soneium: Layer2 = opStackL2({
  createdAt: new UnixTime(1724842746), // 2024-08-28T10:59:06Z
  discovery,
  display: {
    name: 'Soneium',
    slug: 'soneium',
    description:
      'Soneium is an Optimistic rollup based on the OP Stack. It is built by Sony Block Solutions Labs and planned to stand as a versatile, general-purpose blockchain.',
    links: {
      websites: ['https://soneium.org/en/'],
      apps: ['https://bridge.soneium.org/'],
      documentation: ['https://soneium.org/en/docs/'],
      explorers: ['https://soneium.blockscout.com/'],
      repositories: ['https://github.com/Soneium'],
      socialMedia: [
        'https://x.com/soneium',
        'https://t.me/SoneiumOfficial',
        'https://discord.gg/rWWPBHug9w',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.soneium.org',
  finality: {
    type: 'OPStack',
    genesisTimestamp: new UnixTime(1733134753), 
    minTimestamp: new UnixTime(1733134753), 
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'analyze',
  },
  chainConfig: {
    name: 'soneium',
    chainId: 1868, 
    explorerUrl: 'https://soneium.blockscout.com/',
    explorerApi: {
      url: 'https://soneium.blockscout.com/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1733134753), 
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'), // Standard multicall address
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
      },
    ],
  },
  genesisTimestamp: new UnixTime(1733134753), 
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Soneium Launch',
      link: 'https://x.com/soneium/status/1878988222866350348',
      date: '2025-01-14T00:00:00Z',
      description: 'Soneium is live on Ethereum mainnet.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
  discoveryDrivenData: true,
})
