import { ProjectId } from '@l2beat/shared-pure'

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
      'Scroll is an EVM compatible zkRollup that has been designed for use on the Ethereum network. At present, it is undergoing further testing and optimization on the Goerli testnet before deployment.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    links: {
      websites: ['https://scroll.io'],
      apps: ['https://scroll.io/alpha/bridge', 'https://uniswap-v3.scroll.io'],
      documentation: ['https://guide.scroll.io'],
      explorers: [
        'https://scroll.io/alpha/rollupscan',
        'https://blockscout.scroll.io',
        'https://scrollscan-alpha.unifra.io',
      ],
      repositories: [
        'https://github.com/scroll-tech/zkevm-circuits',
        'https://github.com/scroll-tech/zkevm-specs',
        'https://github.com/scroll-tech/scroll-zkevm',
        'https://github.com/scroll-tech/go-ethereum',
        'https://github.com/scroll-tech/frontends',
        'https://github.com/scroll-tech/scroll-contract-deploy-demo',
        'https://github.com/scroll-tech',
      ],
      socialMedia: [
        'https://discord.gg/scroll',
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
