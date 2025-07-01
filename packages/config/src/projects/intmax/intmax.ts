import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const intmax: ScalingProject = underReviewL2({
  id: 'intmax',
  capability: 'universal',
  addedAt: UnixTime(1722256071), // 2024-07-29T12:27:51Z
  display: {
    name: 'INTMAX',
    slug: 'intmax',
    description:
      'INTMAX is a stateless Plasma-like ZK Rollup with permissionless block production.',
    purposes: ['Payments'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://intmax.io/'],
      documentation: [
        'https://eprint.iacr.org/2023/1082.pdf',
        'https://medium.com/intmax/the-deep-dive-into-statelessness-intmax2-algorithm-was-published-be7a306048ff',
      ],
      repositories: ['https://github.com/InternetMaximalism'],
      socialMedia: ['https://twitter.com/intmaxIO'],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0xF65e73aAc9182e353600a916a6c7681F810f79C3'),
      sinceTimestamp: UnixTime(1750500599),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
