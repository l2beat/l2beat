import { CoingeckoId, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const superchain: BaseProject = {
  id: ProjectId('superchain'),
  slug: 'superchain',
  name: 'Superchain',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  display: {
    description: 'The Superchain is a network of OP Stack chains.',
    links: {
      websites: ['https://optimism.io'],
      documentation: [
        'https://docs.optimism.io/',
        'https://docs.optimism.io/superchain/superchain-explainer',
      ],
      explorers: ['https://thesuperscan.io/'],
    },
    badges: [BADGES.Infra.Superchain, BADGES.Stack.OPStack],
  },
  colors: {
    primary: {
      light: '#F00000',
      dark: '#FF1F1F',
    },
    secondary: {
      light: '#F93E3F',
      dark: '#C32525',
    },
  },
  ecosystemConfig: {
    links: {
      buildOn: 'https://optimism.io/',
      learnMore: 'https://docs.optimism.io/superchain/superchain-explainer',
      governanceDelegateToL2BEAT:
        'https://vote.optimism.io/delegates/0x1b686ee8e31c5959d9f5bbd8122a58682788eead',
      governanceProposals: 'https://vote.optimism.io/proposals',
    },
    token: {
      coingeckoId: CoingeckoId('optimism'),
      description:
        'OP is the governance token for the Optimism Collective and the Superchain ecosystem. It is used for voting on protocol upgrades, treasury allocations, and other governance decisions across the Superchain network of OP Stack chains.',
    },
  },
}
