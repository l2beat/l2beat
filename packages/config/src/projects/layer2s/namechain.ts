import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const arithmic: Layer2 = upcomingL2({
  id: 'namechain',
  createdAt: new UnixTime(1732198449), // 2024-11-21T15:14:09Z
  display: {
    name: 'Namechain',
    slug: 'namechain',
    description:
      'Namechain is a ZK Rollup by ENS team serving as an upgrade to their . They are yet to choose their stack.',
    purposes: ['Social'],
    category: 'ZK Rollup', //they didnt decide on the stack yet, prob zksync
    links: {
      websites: ['https://roadmap.ens.domains/l2-roadmap/'],
      apps: ['https://app.ens.domains/'],
      documentation: [
        'https://docs.ens.domains/',
      ],
      explorers: [],
      repositories: ['https://github.com/ensdomains'],
      socialMedia: [
        'https://x.com/ensdomains',
        'https://chat.ens.domains/']
    },
  },
})
