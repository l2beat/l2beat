import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const jovay: ScalingProject = upcomingL2({
  id: 'jovay',
  capability: 'universal',
  addedAt: UnixTime(1754392609),
  hasTestnet: true,
  display: {
    name: 'Jovay',
    slug: 'jovay',
    description:
      'Jovay, by Ant Digital Technologies, is an Ethereum Layer 2 blockchain built for real-world assets and users.',
    purposes: ['Universal', 'RWA'],
    links: {
      websites: ['https://jovay.io/'],
      documentation: ['https://docs.jovay.io/'],
      explorers: ['https://sepolia-explorer.jovay.io/'],
      socialMedia: [
        'https://x.com/JovayNetwork',
        'https://discord.com/invite/8pYGeFAs44',
        'https://t.me/Jovay_Network',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
