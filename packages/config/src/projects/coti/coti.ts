import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const coti: ScalingProject = upcomingL2({
  id: 'coti',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1712133479), // 2024-04-03T08:37:59Z
  display: {
    name: 'Coti',
    slug: 'coti',
    description:
      'Coti is a privacy-centric Ethereum Layer 2 leveraging multiparty computation and secure enclaves for scalable privacy.',
    purposes: ['Universal', 'Privacy'],
    links: {
      websites: ['https://coti.io/'],
      bridges: ['https://bridge.coti.io'],
      documentation: ['https://docs.coti.io/coti-documentation'],
      explorers: ['https://mainnet.cotiscan.io'],
      repositories: ['https://github.com/coti-io'],
      socialMedia: [
        'https://twitter.com/COTInetwork',
        'https://medium.com/@cotinetwork',
        'https://t.me/COTInetwork',
        'https://discord.gg/9tq6CP6XrT',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
