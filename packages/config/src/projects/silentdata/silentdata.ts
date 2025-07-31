import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const silentData: ScalingProject = upcomingL2({
  id: 'silentdata',
  capability: 'universal',
  addedAt: UnixTime(1753945535),
  display: {
    name: 'Silent Data',
    slug: 'silentdata',
    description:
      'Silent Data is an OP Stack L2 combining programmable privacy with lightning-fast throughput, built for institutional scale and web3 innovation.',
    purposes: ['Privacy'],
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://silentdata.com'],
      explorers: ['https://explorer-testnet.rollup.silentdata.com'],
      documentation: ['https://docs.silentdata.com/'],
      socialMedia: [
        'https://linkedin.com/company/69477792',
        'https://twitter.com/SilentDataApp',
        'https://podcasts.apple.com/podcast/applied-blockchain-podcast/id1653098459',
      ],
    },
  },
})
