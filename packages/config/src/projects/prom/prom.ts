import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const prom: ScalingProject = underReviewL2({
  id: 'prom',
  capability: 'universal',
  addedAt: UnixTime(1741702000),
  display: {
    name: 'Prom',
    slug: 'prom',
    description:
      'Prom is the primary access point to the Web3 gaming ecosystem, a cutting-edge Zero-Knowledge (ZK) blockchain developed using the Polygon CDK.',
    purposes: ['Gaming', 'NFT'],
    category: 'ZK Rollup',
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://prom.io/'],
      bridges: ['https://prom.io/bridge'],
      documentation: ['https://prom.gitbook.io/'],
      explorers: ['https://promscan.io/'],
      repositories: [],
      socialMedia: [
        'https://t.me/prom_io',
        'https://twitter.com/prom_io',
        'https://discord.gg/prom',
        'https://instagram.com/prom_io_official',
        'https://medium.com/@prom-io',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  associatedTokens: ['PROM'],
  chainConfig: {
    name: 'prom',
    chainId: 227,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.prom.io/',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x19Cc29954A602761aa3180cd0A33752DcBF4c290'),
      sinceTimestamp: UnixTime(1730199911),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
