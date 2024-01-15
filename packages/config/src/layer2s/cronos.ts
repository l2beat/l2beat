import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const cronos: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('cronos'),
  display: {
    name: 'Cronos zkEVM',
    slug: 'cronos',
    description:
      "Cronos zkEVM is an Ethereum Layer-2 scaling solution that leverages zkSync's ZK Stack, extending the existing portfolio of Cronos apps.",
    purpose: 'Universal',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'ZK Stack',
    links: {
      websites: ['https://cronos.org/'],
      apps: [],
      documentation: ['https://docs.cronos.org/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/cronos_chain'],
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
