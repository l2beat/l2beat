import { ProjectId } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const agglayer: BaseProject = {
  id: ProjectId('agglayer'),
  slug: 'agglayer',
  name: 'Agglayer',
  shortName: undefined,
  addedAt: 1743677000,
  display: {
    description:
      'Agglayer is a cross-chain settlement layer that connects the liquidity and users of any blockchain for fast, low cost interoperability and growth.',
    links: {
      websites: ['https://www.agglayer.dev/'],
    },
    badges: [BADGES.Stack.CDKErigon, BADGES.Infra.AggLayer],
  },
  colors: {
    primary: '#6C00F6',
    secondary: '#6C51F4',
  },
  milestones: [
    {
      title: 'Agglayer v0.3 goes live – Multichain support',
      url: 'https://x.com/Agglayer/status/1937204244559327391',
      date: '2025-06-23T00:00:00Z',
      description:
        'Agglayer v0.3 Is Live: Lays Groundwork for non-CDK Chains to Securely join Agglayer, starting with Polygon PoS',
      type: 'general',
    },
    {
      title: 'Agglayer CDK goes Multistack',
      url: 'https://x.com/Agglayer/status/1920114795333759063',
      date: '2025-05-07T00:00:00Z',
      description:
        'Agglayer CDK (formerly Polygon CDK) goes multistack to unify Web3: Introducing the CDK OP Stack configuration, with native Agglayer connection',
      type: 'general',
    },
  ],
  ecosystemConfig: {
    links: {
      buildOn: 'https://docs.agglayer.dev/',
      learnMore: 'https://www.agglayer.dev/',
      governanceDelegateToL2BEAT:
        'https://governance.polygon.technology/community-members/0x1B686eE8E31c5959D9F5BBd8122a58682788eeaD/',
      governanceProposals: 'https://governance.polygon.technology/proposals/',
    },
    token: {
      tokenId: 'polygonzkevm-POL',
      projectId: ProjectId('polygonzkevm'),
      description:
        'The POL token is used for governance across the Polygon ecosystem, including Polygon PoS and AggLayer chains. It also secures the Polygon PoS network and functions as a gas token on the chain.',
    },
  },
}
