import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const puffer: ScalingProject = upcomingL2({
  id: 'puffer',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1729172001), // 2024-10-17T15:33:21
  display: {
    name: 'Puffer UniFi',
    slug: 'puffer',
    description:
      'UniFi by the Puffer team is their planned flagship based rollup using the Puffer AVS for preconfirmations to explore better UX, security and native yield for users.',
    purposes: ['Universal', 'Restaking'],
    links: {
      websites: ['https://puffer.fi/'],
      bridges: ['https://quest.puffer.fi/unifi'],
      documentation: ['https://docs-unifi.puffer.fi/'],
      repositories: ['https://github.com/PufferFinance'],
      socialMedia: [
        'https://x.com/puffer_unifi',
        'https://discord.com/invite/pufferfi',
        'https://medium.com/puffer-fi',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
