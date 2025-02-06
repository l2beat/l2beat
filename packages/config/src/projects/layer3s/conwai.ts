import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Badge } from '../badges'

export const conwai: Layer3 = upcomingL3({
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
      'Conwai is an AI Supralayer that covering the full artificial intelligence lifecycle.',
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
})
