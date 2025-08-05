import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const rayls: ScalingProject = upcomingL2({
  id: 'rayls',
  capability: 'universal',
  addedAt: UnixTime(1753947052),
  hasTestnet: true,
  display: {
    name: 'Rayls',
    slug: 'rayls',
    description:
      'Rayls is a compliant, KYC-enabled L2 built on Arbitrum Orbit to bridge $100T in TradFi assets into DeFi.',
    purposes: ['Universal', 'RWA'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://rayls.com/'],
      documentation: ['https://docs.rayls.com/'],
      explorers: ['https://rayls-sandbox-chain.explorer.caldera.xyz/'],
      socialMedia: [
        'https://discord.gg/6THZ96357r',
        'https://x.com/RaylsLabs',
        'https://linkedin.com/company/rayls/',
        'https://youtube.com/@RaylsBlockchain',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
