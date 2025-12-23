import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const optimai: ScalingProject = upcomingL2({
  id: 'optimai',
  capability: 'universal',
  addedAt: UnixTime(1765528748),
  hasTestnet: true,
  display: {
    name: 'OptimAI',
    slug: 'optimai',
    description:
      'OptimAI Network is a decentralized Reinforcement Data Network that seamlessly integrates an EVM Layer-2 blockchain.',
    purposes: ['AI'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://optimai.network'],
      repositories: ['https://github.com/optimainetwork/'],
      documentation: ['https://docs.optimai.network'],
      explorers: ['https://explorer.optimai.network'],
      socialMedia: [
        'https://t.me/OptimAINetwork',
        'https://x.com/OptimaiNetwork',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
