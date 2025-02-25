import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const lootchain: Layer2 = upcomingL2({
  id: 'lootchain',
  capability: 'universal',
  addedAt: new UnixTime(1740488493),
  display: {
    name: 'Loot Chain',
    slug: 'lootchain',
    description:
      'Loot Chain is a high-performance, customizable, and application-specific layer-two blockchain deployed with Caldera.',
    purposes: ['NFT'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://lootchain.com/'],
      apps: ['https://mainnet.lootchain.com/bridge'],
      documentation: ['https://loot-chain.gitbook.io/loot-chain-documentation'],
      explorers: ['https://explorer.lootchain.com/'],
      repositories: ['http://github.com/AdventureGoldDao/loot-chain'],
      socialMedia: [
        'https://mirror.xyz/aglddao.eth',
        'https://discord.com/invite/WMXwkcGnNk',
        'https://x.com/AdventureLayer',
      ],
    },
  },
})