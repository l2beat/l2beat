import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const ola: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('ola'),
  display: {
    name: 'Ola',
    slug: 'ola',
    description: 'Ola is an open source hybrid ZK Rollup that delivers programmable scalability and data ownership (Privacy) to blockchain ecosystems.',
    purpose: 'Privacy',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'NotApplicable',
    links: {
      websites: ['https://www.olavm.org/'],
      apps: [],
      documentation: ['https://ola-2.gitbook.io/ola-developer-documents/'],
      explorers: [],
      repositories: ['https://github.com/Sin7Y'],
      socialMedia: [
        'https://twitter.com/ola_zkzkvm',
        'https://discord.com/invite/vDFy7YEG6j',
        'https://www.linkedin.com/company/olavm-technology-ltd/',
        'https://hackmd.io/@sin7y',
        'https://medium.com/@ola_zkzkvm',
        'https://www.youtube.com/@Ola_Sin7y',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}