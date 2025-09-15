import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const okto: ScalingProject = upcomingL2({
  id: 'okto',
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  display: {
    name: 'Okto',
    slug: 'okto',
    description:
      'An L2 designed to streamline blockchain complexity across multiple layers, including wallet, transactions, chain, data, and liquidity.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://okto.tech/'],
      documentation: ['https://docsv2.okto.tech/docs'],
      repositories: ['https://github.com/okto-hq'],
      socialMedia: [
        'https://x.com/okto_web3',
        'https://discord.gg/okto-916349620383252511',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
