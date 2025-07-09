import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const mawari: ScalingProject = upcomingL2({
  id: 'mawari',
  addedAt: UnixTime(1744635768), // 2025-04-14T14:42:48Z
  capability: 'universal',
  display: {
    name: 'Mawari',
    slug: 'mawari',
    description:
      "Mawari is the world's first DePIN for Spatial Computing. The Mawari Network powers real-time streaming of immersive AI-driven experiences with near 0 latency.",
    purposes: ['AI'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://mawari.net/'],
      explorers: ['https://mawari-network-testnet.explorer.caldera.xyz/'],
      socialMedia: [
        'https://t.me/mawarinet',
        'https://x.com/mawariXR',
        'https://discord.com/invite/mawari',
        'https://linkedin.com/company/mawari/',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
