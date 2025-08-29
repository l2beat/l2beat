import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const oceanum: ScalingProject = upcomingL3({
  id: 'oceanum',
  capability: 'universal',
  addedAt: UnixTime(1755098742),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Oceanum',
    slug: 'oceanum',
    stacks: ['Arbitrum'],
    description:
      'Oceanum is an AI-specific L3 with Caldera, bringing AI agent scaling across multiple blockchains by Bluwhale.',
    purposes: ['AI'],
    links: {
      websites: ['https://bluwhale.com/'],
      documentation: ['https://bluwhale.gitbook.io/bluwhaleai/'],
      explorers: ['https://oceanum-testnet.explorer.caldera.xyz/'],
      bridges: ['https://oceanum-testnet.bridge.caldera.xyz/'],
      socialMedia: [
        'https://x.com/bluwhaleai',
        'https://discord.com/invite/bluwhale',
        'https://medium.com/@bluwhaleai',
        'https://youtube.com/@bluwhaleai',
        'https://linkedin.com/company/bluwhaleai',
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
