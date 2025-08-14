import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const namechain: ScalingProject = upcomingL2({
  id: 'namechain',
  capability: 'universal',
  addedAt: UnixTime(1750840537), // 2025-06-25T08:35:37+00:00
  display: {
    name: 'Namechain',
    slug: 'namechain',
    description:
      'Namechain is an upcoming Ethereum L2 chain built on the Linea tech stack. It’s designed to be the home of Ethereum Name Service (ENS) and accompanying identity applications.',
    purposes: ['Identity'],
    links: {
      websites: ['https://app.ens.domains/ens-v2'],
      documentation: ['https://roadmap.ens.domains/l2-roadmap/'],
      repositories: ['https://github.com/ensdomains/namechain'],
      socialMedia: [
        'https://x.com/ensdomains',
        'https://discord.com/invite/TZmGtEP',
        'https://farcaster.xyz/ensdomains',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
