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
      websites: ['https://arbitrum.io'],
    },
    badges: [BADGES.Stack.Orbit],
  },
  ecosystemConfig: {
    links: {
      buildOn:
        'https://docs.arbitrum.io/launch-orbit-chain/a-gentle-introduction',
      learnMore: 'https://arbitrum.io/orbit',
      governanceTopDelegates: 'https://www.tally.xyz/gov/arbitrum/delegates',
      governanceProposals: 'https://www.tally.xyz/gov/arbitrum/proposals',
    },
    colors: {
      primary: '#12AAFF',
      secondary: '#12AAFF',
    },
    nativeToken: {
      id: 'arbitrum-ARB',
      description:
        'ARB is the governance token for the Arbitrum Orbit ecosystem. It is used for voting on protocol upgrades, treasury allocations, and other governance decisions across the Orbit network of Arbitrum chains.',
    },
  },
}
