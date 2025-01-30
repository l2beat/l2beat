import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const kakarotzkevm: Layer2 = upcomingL2({
  id: 'kakarotzkevm',
  capability: 'universal',
  addedAt: new UnixTime(1712943035), // 2024-04-12T17:30:35Z
  display: {
    name: 'Kakarot zkEVM',
    slug: 'kakarotzkevm',
    description:
      'Kakarot is an EVM-compatible ZK Rollup that leverages Cairo to spearhead innovations on Ethereum.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://kakarot.org/'],
      documentation: ['https://docs.kakarot.org/'],
      explorers: ['https://sepolia.kakarotscan.org/'],
      repositories: ['https://github.com/kkrt-labs/kakarot'],
      socialMedia: [
        'https://twitter.com/KakarotZkEvm',
        'https://t.me/KakarotZkEvm',
        'https://discord.gg/kakarotzkevm',
        'https://linkedin.com/company/kkrt-labs',
      ],
      rollupCodes: 'https://rollup.codes/kakarot',
    },
  },
})
