import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const mawari: ScalingProject = upcomingL2({
  id: 'mawari',
  addedAt: UnixTime(1744635768), // 2025-04-14T14:42:48Z
  capability: 'universal',
  hasTestnet: true,
  display: {
    name: 'Mawari',
    slug: 'mawari',
    description:
      "Mawari is the world's first DePIN for Spatial Computing. The Mawari Network powers real-time streaming of immersive AI-driven experiences with near 0 latency.",
    purposes: ['AI'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://mawari.net/'],
      bridges: ['https://mawari-network-testnet.bridge.caldera.xyz'],
      documentation: ['https://docs.mawari.net'],
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
  proofSystem: {
    type: 'Optimistic',
  },
})
