import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const happychain: Layer2 = upcomingL2({
  id: 'happy-chain',
  capability: 'universal',
  addedAt: new UnixTime(1727519160), // 2024-09-27T17:09:00Z
  display: {
    name: 'Happy chain',
    slug: 'happy-chain',
    description:
      'HappyChain is an Ethereum L2 chain that brings free-to-play and zero-friction onboarding onchain.',
    purposes: ['Universal', 'Gaming'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://linktr.ee/happychaindevs'],
      socialMedia: [
        'https://x.com/HappyChainDevs',
        'https://mirror.xyz/0x20Af38e22e1722F97f5A1b5afc96c00EECd566b2',
      ],
    },
  },
})
