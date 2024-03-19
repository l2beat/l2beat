import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const popapex: Layer3 = underReviewL3({
  id: 'popapex',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Proof of Play Apex',
    slug: 'popapex',
    category: 'Optimium',
    description:
      'Proof of Play Apex is a gaming-focused L3 settling on Arbitrum using Conduit and the AnyTrust Orbit stack flavour.',
    purposes: ['Gaming', 'NFT'],
    provider: 'Arbitrum Orbit',
    links: {
      websites: ['https://proofofplay.gg'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=pop-apex&sourceChain=arbitrum-one',
        'https://piratenation.game/',
      ],
      documentation: [],
      explorers: ['https://explorer.apex.proofofplay.com'],
      repositories: ['https://github.com/proofofplay'],
      socialMedia: [
        'https://twitter.com/ProofOfPlay/',
        'https://discord.com/invite/piratenation',
        'https://piratenation.medium.com/',
      ],
    },
  },
})
