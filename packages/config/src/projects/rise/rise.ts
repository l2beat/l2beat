import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const rise: ScalingProject = upcomingL2({
  id: 'rise',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1713776957), // 2024-04-22T09:09:17Z
  display: {
    name: 'RISE',
    slug: 'rise',
    description:
      'RISE is a Parallel EVM Rollup that intends to unlock a new era of performance for Ethereum.',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://riselabs.xyz/'],
      bridges: ['https://bridge-ui.testnet.riselabs.xyz'],
      documentation: ['https://docs.riselabs.xyz/'],
      repositories: ['https://github.com/risechain'],
      explorers: ['https://explorer.testnet.riselabs.xyz'],
      socialMedia: [
        'https://discord.com/invite/risechain',
        'https://medium.com/@rise_chain',
        'https://x.com/rise_chain',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
