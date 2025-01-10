import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const hashkey: Layer2 = upcomingL2({
  id: 'hashkey',
  createdAt: new UnixTime(1736518370), // 2025-01-10T17:09:00Z
  display: {
    name: 'HashKey Chain',
    slug: 'hashkey',
    description:
      'HashKey Chain is a regulatory-compliant, institutional-grade Layer 2 solution bridging traditional finance and Web3. It’s powered by Hong Kong’s premier virtual asset ecosystem.',
    purposes: ['Exchange'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://hsk.xyz/'],
      apps: ['https://hsk.xyz/faucet'],
      documentation: ['https://docs.hsk.xyz/'],
      explorers: ['https://explorer.hsk.xyz/'],
      repositories: ['https://github.com/HashKeyChain'],
      socialMedia: [
        'https://x.com/HashKeyHSK',
        'https://t.me/hashkeyhsk',
        'https://discord.com/invite/ujaF7aKAEk',
      ],
    },
  },
})
