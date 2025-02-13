import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const conwai: Layer3 = underReviewL3({
  id: 'conwai',
  capability: 'universal',
  addedAt: new UnixTime(1739364151),
  badges: [
    Badge.L3ParentChain.Arbitrum,
    Badge.Stack.Orbit,
    Badge.VM.EVM,
    Badge.RaaS.Caldera,
  ],
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'ConWai',
    slug: 'conwai',
    description:
      'Conwai is an Optimium using the Orbit stack. It is focused on supporting AI-driven applications.',
    purposes: ['AI'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://conwai.net'],
      documentation: ['https://conwai.net/docs'],
      apps: ['https://conwai.bridge.caldera.xyz/'],
      explorers: ['https://conwai.calderaexplorer.xyz/'],
      socialMedia: [
        'https://twitter.com/conwainet',
        'https://discord.gg/SMebb4QREy',
        'https://t.me/conwainet',
      ],
    },
  },
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://conwai.calderachain.xyz/http',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
  },
}) //no escrow cause token is not on CG
