import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const bob: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('bob'),
  display: {
    name: 'BOB',
    slug: 'bob',
    description:
      'BOB ("Build on Bitcoin") is the first EVM rollup stack with native Bitcoin support.',
    purpose: 'Bitcoin Dapps',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://gobob.xyz'],
      apps: [],
      documentation: ['https://docs.gobob.xyz'],
      explorers: ['https://explorerl2-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/'],
      repositories: ['https://github.com/bob-collective'],
      socialMedia: [
        'https://twitter.com/build_on_bob'
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
