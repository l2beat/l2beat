import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const nil: Layer2 = upcomingL2({
  id: '=nil;',
  createdAt: new UnixTime(1708529553), // 2024-02-21T15:32:33Z
  display: {
    name: '=nil;',
    slug: 'nil',
    description:
      '=nil; is a zkRollup that securely scales Ethereum through zkSharding, empowering web3 developers to build scalable and composable applications.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://nil.foundation/'],
      apps: [],
      documentation: ['https://docs.nil.foundation/nil/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/nil_foundation'],
    },
  },
})
