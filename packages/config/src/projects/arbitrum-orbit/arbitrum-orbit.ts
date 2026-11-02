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
      documentation: ['https://docs.arbitrum.io/get-started/overview'],
    },
    badges: [BADGES.Stack.Orbit],
  },
  colors: {
    primary: {
      light: '#12AAFF',
      dark: '#33BFFF',
    },
    secondary: {
      light: '#12AAFF',
      dark: '#0A6EA3',
    },
  },
}
