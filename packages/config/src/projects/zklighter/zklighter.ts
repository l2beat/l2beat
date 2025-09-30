import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const zklighter: ScalingProject = upcomingL2({
  id: 'zklighter',
  capability: 'universal',
  addedAt: UnixTime(1711551933), // 2024-03-27T15:05:33Z
  display: {
    name: 'Lighter',
    slug: 'lighter',
    description:
      'Lighter is an application-specific zk rollup on a mission to revolutionize trading by building provably fair, secure, and scalable infrastructure for finance.',
    purposes: ['Universal', 'Exchange'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://lighter.xyz', 'https://app.lighter.xyz/'],
      explorers: ['https://scan.lighter.xyz'],
      documentation: [
        'https://docs.lighter.xyz',
        'https://assets.lighter.xyz/whitepaper.pdf',
      ],
      repositories: ['https://github.com/elliottech'],
      socialMedia: [
        'https://x.com/Lighter_xyz',
        'https://discord.gg/lighterxyz',
        'https://linkedin.com/company/lighter-xyz',
        'https://t.me/lighterxyz_official',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
