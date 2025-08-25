import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const novastro: ScalingProject = upcomingL3({
  id: 'novastro',
  addedAt: UnixTime(1748172804),
  capability: 'universal',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Novastro',
    slug: 'novastro',
    description:
      'Novastro is a RWAfi Layer 3 for the EVM & Aptos ecosystem powered by AI. Tokenize, Trade, and Earn Yields on Real World Assets.',
    purposes: ['AI', 'RWA'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://novastro.xyz/'],
      explorers: [],
      documentation: ['https://docs.novastro.xyz/novastro_chain'],
      repositories: ['https://github.com/novastro-chain'],
      socialMedia: [
        'https://x.com/Novastro_xyz',
        'https://t.me/Novastro_Chain',
        'https://discord.com/invite/AaPvm8ZvuG',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
