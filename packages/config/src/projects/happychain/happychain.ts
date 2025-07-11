import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const happychain: ScalingProject = upcomingL2({
  id: 'happychain',
  capability: 'universal',
  addedAt: UnixTime(1727519160), // 2024-09-27T17:09:00Z
  display: {
    name: 'Happy chain',
    slug: 'happy-chain',
    description:
      'HappyChain is an Ethereum L2 chain that brings free-to-play and zero-friction onboarding onchain.',
    purposes: ['Universal', 'Gaming'],
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://linktr.ee/happychaindevs'],
      socialMedia: [
        'https://x.com/HappyChainDevs',
        'https://mirror.xyz/0x20Af38e22e1722F97f5A1b5afc96c00EECd566b2',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
})
