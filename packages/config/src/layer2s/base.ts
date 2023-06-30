import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const base: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('base'),
  display: {
    name: 'Base',
    slug: 'base',
    description:
      'Base is an Optimistic Rollup that has been developed on the Ethereum network, utilizing OP Stack technology. It is currently in the incubation phase at Coinbase and intends to gradually transition towards a more decentralized model over the coming years. At present, Base is deployed on the Goerli testnet for further testing and optimization.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'Optimism',
    links: {
      websites: ['https://base.org/'],
      apps: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: ['https://goerli.basescan.org/'],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
