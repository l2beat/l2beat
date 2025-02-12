import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Badge } from '../badges'

export const g7: Layer3 = upcomingL3({
  id: 'g7',
  capability: 'universal',
  addedAt: new UnixTime(1738899615),
  badges: [
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Conduit,
  ],
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Game7',
    slug: 'g7',
    description:
      'Game7 is a DAO initiated by BitDAO and Forte to accelerate the adoption of sustainable, web3-native gaming.',
    purposes: ['Gaming'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://game7.io/'],
      documentation: ['https://docs.game7.io/'],
      apps: ['https://build.game7.io/bridge'],
      explorers: ['https://testnet.game7.io/'],
      repositories: ['https://github.com/G7DAO'],
      socialMedia: [
        'https://discord.gg/g7dao',
        'https://x.com/G7_DAO',
        'https://mirror.xyz/0x17D15C35b9c50032eE98f5730934ff85F9c16acA',
        'https://youtube.com/@G7_DAO',
      ],
    },
  },
})
