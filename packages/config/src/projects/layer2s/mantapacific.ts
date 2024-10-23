import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'

import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantapacific')

export const mantapacific: Layer2 = opStackL2({
  createdAt: new UnixTime(1693907285), // 2023-09-05T09:48:05Z
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Manta Pacific',
    slug: 'mantapacific',
    architectureImage: 'mantapacific',
    description:
      'Manta Pacific is an Optimium empowering EVM-native zero-knowledge (ZK) applications and general dapps.',
    links: {
      websites: ['https://pacific.manta.network/'],
      apps: ['https://pacific-bridge.manta.network/'],
      documentation: ['https://docs.manta.network/'],
      explorers: [
        'https://pacific-explorer.manta.network/',
        'https://169.routescan.io/',
      ],
      repositories: ['https://github.com/Manta-Network'],
      socialMedia: [
        'https://discord.gg/mantanetwork',
        'https://twitter.com/MantaNetwork',
        'https://medium.com/@mantanetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://pacific-rpc.manta.network/http',
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://pacific-rpc.manta.network/http',
    defaultCallsPerMinute: 1500,
    startBlock: 1,
    assessCount: subtractOne,
  },
  associatedTokens: ['MANTA'],
  chainConfig: {
    name: 'mantapacific',
    chainId: 169,
    explorerUrl: 'https://pacific-explorer.manta.network',
    explorerApi: {
      url: 'https://pacific-explorer.manta.network/api',
      type: 'blockscout',
    },
    // ~ Timestamp of block number 0 on MantaPacific
    // https://pacific-explorer.manta.network/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-09-09T01:45:59Z')),
    multicallContracts: [
      {
        sinceBlock: 332890,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
      {
        sinceBlock: 54816,
        batchSize: 150,
        address: EthereumAddress('0x9731502B98F65BBb573D0106ECd9E4097dbcCD30'),
        version: '2',
      },
    ],
    coingeckoPlatform: 'manta-pacific',
  },
  genesisTimestamp: new UnixTime(1679202395),
  isNodeAvailable: false,
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Manta Pacific Network Launch',
      link: 'https://mantanetwork.medium.com/manta-pacific-mainnet-alpha-launch-743c6bc2b95e',
      date: '2023-09-12T00:00:00Z',
      description: 'Manta Pacific is live on mainnet.',
      type: 'general',
    },
  ],
  badges: [Badge.DA.Celestia, Badge.RaaS.Caldera],
  knowledgeNuggets: [
    {
      title: 'Blobstream and Celestia Architecture',
      url: 'https://www.youtube.com/watch?v=cn_fN6pkakQ',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
})
