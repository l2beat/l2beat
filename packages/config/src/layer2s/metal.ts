import { ProjectId } from '@l2beat/shared-pure'
import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const metal: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('metal'),
  display: {
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is an upcoming scalling solution by Metallicus. It is powered by the OP Stack.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://metall2.com/'],
      apps: [],
      documentation: [],
      explorers: ['https://testnet-explorer.metall2.com/'],
      repositories: [],
      socialMedia: ['https://twitter.com/metalpaysme'],
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
