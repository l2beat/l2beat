import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const reddiozkvm: ScalingProject = upcomingL2({
  id: ProjectId('reddiozkvm'),
  capability: 'universal',
  addedAt: UnixTime(1704460390), // 2024-01-05T13:13:10Z
  display: {
    name: 'Reddio zkVM',
    slug: 'reddiozkvm',
    description:
      'Reddio zkVM is an upcoming ZK Rollup focused on general use cases like Games and Apps, powered by Starknet Stack.',
    purposes: ['Universal', 'Gaming'],
    category: 'ZK Rollup',
    stack: ['SN Stack'],
    links: {
      websites: ['https://reddio.com'],
      documentation: [
        'https://docs.reddio.com/guide/starknet/smart-contracts/overview.html',
      ],
      repositories: ['https://github.com/reddio-com/starknet-appchain-utils'],
      socialMedia: [
        'https://twitter.com/reddio_com',
        'https://facebook.com/reddiocom',
        'https://linkedin.com/company/reddio',
      ],
    },
  },
})
