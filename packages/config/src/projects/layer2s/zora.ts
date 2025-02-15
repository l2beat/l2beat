import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('zora')

export const zora: Layer2 = opStackL2({
  addedAt: new UnixTime(1687459278), // 2023-06-22T18:41:18Z
  discovery,
  additionalBadges: [Badge.RaaS.Conduit],
  additionalPurposes: ['NFT'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Zora',
    slug: 'zora',
    description:
      'Zora is a fast, cost-efficient, and scalable Layer 2 built to help bring media onchain, powered by the OP Stack.',
    links: {
      websites: ['https://zora.energy/', 'https://zora.co/'],
      documentation: ['https://docs.zora.co/docs/zora-network/intro'],
      explorers: [
        'https://explorer.zora.energy/',
        'https://zora.superscan.network',
      ],
      repositories: ['https://github.com/ourzora/optimism'],
      socialMedia: [
        'https://twitter.com/zora',
        'https://instagram.com/our.zora',
        'https://zora.community',
      ],
    },
  },
  rpcUrl: 'https://rpc.zora.energy',
  finality: {
    type: 'OPStack',
    genesisTimestamp: new UnixTime(1686693839),
    minTimestamp: new UnixTime(1710386579),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'analyze',
  },
  chainConfig: {
    name: 'zora',
    chainId: 7777777,
    explorerUrl: 'https://explorer.zora.energy',
    explorerApi: {
      url: 'https://explorer.zora.energy/api',
      type: 'blockscout',
    },
    // ~ Timestamp of block number 0 on Zora
    // The first full hour timestamp that will return the block number
    // https://explorer.zora.energy/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-06-14T01:04:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5882,
        version: '3',
      },
    ],
    coingeckoPlatform: 'zora',
  },
  genesisTimestamp: new UnixTime(1686695915),
  stateDerivation: DERIVATION.OPSTACK('ZORA'),
  isNodeAvailable: true,
  milestones: [
    {
      title: 'Zora starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Zora starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Zora Network Launch',
      url: 'https://twitter.com/ourZORA/status/1671602234994622464',
      date: '2023-06-21T00:00:00Z',
      description: 'Zora Network is live on mainnet.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
})
