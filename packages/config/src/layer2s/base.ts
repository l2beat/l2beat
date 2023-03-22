import { ProjectId } from '@l2beat/shared'

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
      'Base will be an Optimistic Rollup deployed on Ethereum, built using OP Stack technology. Base is incubated within Coinbase and plans to progressively decentralize in the years ahead. Currently, Base is deployed on the Goerli testnet.',
    purpose: 'Universal',
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
  technology: {
    ...TECHNOLOGY.UPCOMING,
    category: 'Optimistic Rollup',
    provider: 'Optimism',
  },
  contracts: CONTRACTS.EMPTY,
}
