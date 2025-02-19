import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const snaxchain: Layer2 = upcomingL2({
  id: 'snaxchain',
  capability: 'universal',
  addedAt: new UnixTime(1740099913),
  display: {
    name: 'SNAXchain',
    slug: 'snaxchain',
    description:
      'SNAXchain, developed by Synthetix, is a Layer-2 blockchain built on the OP Stack. It joins the Superchain ecosystem to enhance decentralized governance and streamline operations.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://governance.synthetix.io/'],
      repositories: ['https://github.com/Synthetixio/snaxchain-config'],
      documentation: ['https://sips.synthetix.io/sips/sip-384/'],
      socialMedia: ['https://x.com/synthetix_io'],
    },
  },
})
