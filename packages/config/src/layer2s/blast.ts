import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('blast')

export const blast: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('blast'),
  display: {
    name: 'Blast',
    slug: 'blast',
    headerWarning:
      'The bridge is deposit-only and funds cannot be withdrawn yet.',
    description:
      'Blast will launch an EVM-compatible Optimistic Rollup supporting native yield. It currently only supports deposits and no withdrawal mechanism is available yet.',
    purpose: 'Universal, DeFi',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'NotApplicable',
    links: {
      websites: ['https://blast.io/en'],
      apps: ['https://blast.io/en/airdrop/early-access'],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Blast_L2'],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d'),
        tokens: '*',
        description: 'Blast bridge.',
        isUpcoming: true,
      }),
    ],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
