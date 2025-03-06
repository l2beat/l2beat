import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../internalTypes'
import { upcomingL2 } from './templates/upcoming'

export const lootchain: Layer2 = upcomingL2({
  id: 'lootchain',
  capability: 'universal',
  addedAt: new UnixTime(1740488493),
  display: {
    name: 'Loot Chain',
    slug: 'lootchain',
    description:
      'Loot Chain is a high-performance, customizable L2 blockchain deployed with Caldera. It provides specialized support for builders on Lootverse and Autonomous Worlds.',
    purposes: ['NFT'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://lootchain.com/'],
      apps: ['https://mainnet.lootchain.com/bridge'],
      documentation: ['https://loot-chain.gitbook.io/loot-chain-documentation'],
      explorers: ['https://explorer.lootchain.com/'],
      repositories: ['https://github.com/AdventureGoldDao/loot-chain'],
      socialMedia: [
        'https://mirror.xyz/aglddao.eth',
        'https://discord.com/invite/WMXwkcGnNk',
        'https://x.com/AdventureLayer',
      ],
    },
  },
})
