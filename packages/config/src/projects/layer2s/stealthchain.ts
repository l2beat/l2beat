import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const stealthchain: Layer2 = upcomingL2({
  id: 'stealthchain',
  capability: 'universal',
  addedAt: new UnixTime(1694778975), // 2023-09-15T11:56:15Z
  display: {
    name: 'StealthChain',
    slug: 'stealthchain',
    description: 'Degen Stealth Launchpad, Cross Chain Token Bridge & LP Pool.',
    purposes: ['Launchpad'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://stealthchain.org'],
      documentation: ['https://docs.stealthchain.org'],
      explorers: [
        'https://test.stealthscan.xyz/',
        'https://stealthpad.instatus.com/',
      ],
      repositories: ['https://github.com/stealthpadxyz'],
      socialMedia: [
        'https://twitter.com/stealthpadxyz',
        'https://discord.gg/tWA5AhUS',
        'https://mirror.xyz/stealthpad.eth',
      ],
    },
  },
})
