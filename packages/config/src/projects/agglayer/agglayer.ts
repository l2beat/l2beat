import { ProjectId } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const agglayer: BaseProject = {
  id: ProjectId('agglayer'),
  slug: 'agglayer',
  name: 'AggLayer',
  shortName: undefined,
  addedAt: 1743677000,
  display: {
    description:
      'Agglayer is a cross-chain settlement layer that connects the liquidity and users of any blockchain for fast, low cost interoperability and growth.',
    links: {
      websites: ['https://www.agglayer.dev/'],
    },
    badges: [BADGES.Stack.PolygonCDK, BADGES.Infra.AggLayer],
  },
  ecosystemConfig: {
    links: {
      buildOn: 'https://docs.agglayer.dev/',
      learnMore: 'https://www.agglayer.dev/',
      governanceTopDelegates:
        'https://governance.polygon.technology/community-members/',
      governanceProposals: 'https://governance.polygon.technology/proposals/',
    },
    colors: {
      primary: '#6C00F6',
      secondary: '#6C51F4',
    },
    token: {
      tokenId: 'polygonzkevm-POL',
      projectId: ProjectId('polygonzkevm'),
      description:
        'POL is the native token of Polygon that enables users to interact dApps across Polygon blockchains. It is also used to secure the network through staking.',
    },
  },
}
