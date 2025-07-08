import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const arbitrumOrbit: BaseProject = {
  id: ProjectId('arbitrum-orbit'),
  slug: 'arbitrum-orbit',
  name: 'Arbitrum Orbit',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-04-08')),
  display: {
    description: 'The Arbitrum Orbit is a network of Arbitrum chains.',
    links: {
      websites: ['https://arbitrum.io', 'https://portal.arbitrum.io/'],
      bridges: ['https://bridge.arbitrum.io/'],
    },
    badges: [BADGES.Stack.Orbit],
  },
  colors: {
    primary: '#12AAFF',
    secondary: '#12AAFF',
  },
  milestones: [
    {
      title: 'Arbitrum Orbit launch',
      url: 'https://arbitrumfoundation.medium.com/arbitrum-the-next-phase-of-decentralization-e7f8b37b5226',
      date: '2023-03-16T00:00:00.00Z',
      description:
        'Arbitrum Foundation announces the launch of the Arbitrum Orbit stack.',
      type: 'general',
    },
    {
      title: 'Timeboost launch',
      url: 'https://x.com/arbitrum/status/1912945720237367449',
      date: '2025-04-17T00:00:00.00Z',
      description:
        'Arbitrum launches Timeboost - a new transaction ordering policy for Arbitrum chains',
      type: 'general',
    },
  ],
  ecosystemConfig: {
    links: {
      buildOn:
        'https://docs.arbitrum.io/launch-orbit-chain/a-gentle-introduction',
      learnMore: 'https://arbitrum.io/orbit',
      governanceDelegateToL2BEAT:
        'https://www.tally.xyz/gov/arbitrum/delegate/0x1b686ee8e31c5959d9f5bbd8122a58682788eead',
      governanceProposals: 'https://www.tally.xyz/gov/arbitrum/proposals',
    },
    token: {
      tokenId: 'arbitrum-ARB-1',
      projectId: ProjectId('arbitrum'),
      description:
        'ARB is the governance token for the Arbitrum Orbit ecosystem. It is used for voting on protocol upgrades, treasury allocations, and other governance decisions across the Orbit network of Arbitrum chains.',
    },
  },
}
