import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const novastro: Layer2 = upcomingL2({
  id: 'novastro',
  capability: 'universal',
  addedAt: new UnixTime(1740486734),
  display: {
    name: 'Novastro',
    slug: 'novastro',
    description:
      'Novastro is a Layer 2 RWA chain powered by Movement Labs. Tokenize, Trade, and Earn AI-optimised yields on RWAs.',
    purposes: ['RWA'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://novastro.xyz/'],
      documentation: ['https://docs.novastro.xyz/novastro_chain'],
      explorers: ['https://explorer.novastro.xyz/'],
      repositories: ['https://github.com/novastro-chain'],
      socialMedia: [
        'https://x.com/Novastro_xyz',
        'https://t.me/Novastro_Chain',
        'https://discord.com/invite/AaPvm8ZvuG',
      ],
    },
  },
})
