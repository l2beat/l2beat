import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const stealthchain: Layer2 = upcoming({
  id: 'stealthchain',
  display: {
    name: 'StealthChain',
    slug: 'stealthchain',
    description: 'Degen Stealth Launchpad, Cross Chain Token Bridge & LP Pool.',
    purposes: ['Launchpad'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://stealthchain.org'],
      apps: [],
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
