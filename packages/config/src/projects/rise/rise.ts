import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const rise: ScalingProject = upcomingL2({
  id: 'rise',
  capability: 'universal',
  addedAt: UnixTime(1713776957), // 2024-04-22T09:09:17Z
  display: {
    name: 'RISE',
    slug: 'rise',
    description:
      'RISE is a Parallel EVM Rollup that intends to unlock a new era of performance for Ethereum.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://riselabs.xyz/'],
      documentation: ['https://docs.riselabs.xyz/'],
      repositories: ['https://github.com/risechain'],
      socialMedia: [
        'https://discord.com/invite/4yWVabz63y',
        'https://medium.com/@rise_chain',
        'https://x.com/rise_chain',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
})
