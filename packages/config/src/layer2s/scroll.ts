import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const scroll: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('scroll'),
  display: {
    name: 'Scroll',
    slug: 'scroll',
    description:
      'Scroll is a zkEVM-based zkRollup on Ethereum that enables native compatibility for existing Ethereum applications and tools.',
    purpose: 'Universal',
    links: {
      websites: ['https://scroll.io/'],
      apps: ['https://scroll.io/alpha/bridge'],
      documentation: ['https://guide.scroll.io/', 'https://scroll.io/alpha'],
      explorers: ['https://blockscout.scroll.io/'],
      repositories: [
        'https://github.com/scroll-tech/zkevm-circuits',
        'https://github.com/scroll-tech/go-ethereum',
        'https://github.com/scroll-tech/scroll-zkevm',
        'https://github.com/scroll-tech',
      ],
      socialMedia: [
        'https://discord.gg/scroll',
        'https://www.youtube.com/@Scroll_ZKP',
        'https://twitter.com/Scroll_ZKP',
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
