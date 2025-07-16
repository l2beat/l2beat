import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const reddiozkvm: ScalingProject = underReviewL2({
  id: ProjectId('reddiozkvm'),
  addedAt: UnixTime(1684838286), // 2023-05-23T10:38:06Z
  capability: 'universal',
  display: {
    name: 'Reddio',
    slug: 'reddiozkvm',
    description:
      'Reddio aims to bring the world’s first GPU-Accelerated Parallel EVM architecture to live production. Purpose-built for compute-intensive and AI-native applications, it opens a new frontier of speed and programmability within Ethereum’s ecosystem.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://reddio.com/'],
      bridges: [
        'https://reddio.com/explore',
        'https://dashboard.reddio.com',
        'https://bridge.reddio.com',
        'https://reddio.com/redSonic',
      ],
      documentation: ['https://docs.reddio.com/'],
      explorers: [
        'https://reddio.cloud.blockscout.com/',
        'https://explorer.reddio.com/',
      ],
      repositories: ['https://github.com/reddio-com/reddio'],
      socialMedia: [
        'https://twitter.com/reddio_com',
        'https://facebook.com/reddiocom',
        'https://linkedin.com/company/reddio',
        'https://discord.com/invite/SjNAJ4qkK3',
      ],
    },
  },
  associatedTokens: ['RDO'],
  chainConfig: {
    name: 'reddiozkvm',
    gasTokens: ['RDO'],
    chainId: 50342,
    sinceTimestamp: UnixTime(1748332268),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.reddio.com/rpc',
        callsPerMinute: 1500,
      },
    ],
  },
  escrows: [
    {
      address: EthereumAddress('0xCc0a76eE23BBc536b0A72C965C1b76289A48D7D4'),
      sinceTimestamp: UnixTime(1749456131),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
  // milestones: [
  //   {
  //     title: 'Reddio Announces Mainnet Launch',
  //     url: 'https://blog.reddio.com/announces-layer2-zkrollup-mainnet-launch/',
  //     date: '2022-09-29T00:00:00Z',
  //     description: 'Reddio announces its Validium Mainnet launch.',
  //     type: 'general',
  //   },
  // ],
})
