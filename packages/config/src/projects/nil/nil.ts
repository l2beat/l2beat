import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const nil: ScalingProject = upcomingL2({
  id: 'nil',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1708529553), // 2024-02-21T15:32:33Z
  display: {
    name: '=nil;',
    slug: 'nil',
    description:
      '=nil; is a zkRollup that securely scales Ethereum through zkSharding, empowering web3 developers to build scalable and composable applications.',
    purposes: ['Universal'],
    links: {
      websites: ['https://nil.foundation/'],
      documentation: ['https://docs.nil.foundation/'],
      explorers: ['https://explore.nil.foundation'],
      repositories: ['https://github.com/nilfoundation'],
      socialMedia: [
        'https://twitter.com/nil_foundation',
        'https://t.me/nilfoundation',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
