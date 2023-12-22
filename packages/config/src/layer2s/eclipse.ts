import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('eclipse')

export const eclipse: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('eclipse'),
  display: {
    name: 'Eclipse Mainnet',
    slug: 'eclipse-mainnet',
    description:
      'Eclipse is Ethereum\'s fastest Layer 2, powered by the Solana Virtual Machine (SVM).',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'NotApplicable',
    links: {
      websites: ['https://eclipse.builders/'],
      apps: ['https://bridge.eclipse.builders/'],
      documentation: ['https://docs.eclipse.builders/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/eclipsefnd',
        'https://discord.gg/eclipse-labs',
        'https://eclipsemainnet.mirror.xyz/',
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