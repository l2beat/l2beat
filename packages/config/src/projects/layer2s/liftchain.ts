import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const liftchain: Layer2 = upcomingL2({
  id: 'liftchain',
  capability: 'universal',
  addedAt: new UnixTime(1715161986), // 2024-05-08T09:53:06Z
  display: {
    name: 'LIFTChain',
    slug: 'liftchain',
    description:
      'LIFTChain is a Layer 2 solution built on the ZK Stack leveraging zkEVM in Validium mode. It serves as a Hyperchain allowing anyone to build gaming apps (gApps) on top of their favourite AAA games.',
    purposes: ['Gaming', 'Universal'],
    category: 'Validium',
    stack: 'ZK Stack',
    links: {
      websites: ['https://www.liftdata.ai/'],
      documentation: ['https://docs.liftdata.ai/'],
      repositories: ['https://github.com/PlayFi-Labs'],
      socialMedia: ['https://www.liftdata.ai'],
    },
  },
})
