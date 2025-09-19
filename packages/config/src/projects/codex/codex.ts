import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const codex: ScalingProject = underReviewL2({
  id: 'codex',
  capability: 'universal',
  addedAt: UnixTime(1755480355),
  display: {
    name: 'Codex',
    slug: 'codex',
    stacks: ['OP Stack'],
    description:
      'Codex Chain is a secure, high-throughput, EVM-equivalent Layer 2 blockchain purpose-built for stablecoin-native payments, FX, and settlement.',
    purposes: ['Universal'],
    links: {
      websites: ['https://codex.xyz/'],
      documentation: ['https://docs.codex.xyz/'],
      explorers: ['https://explorer.codex.xyz'],
      socialMedia: [
        'https://x.com/codex_pbc',
        'https://linkedin.com/company/codex-pbc',
      ],
    },
  },
  chainConfig: {
    name: 'codex',
    gasTokens: ['ETH'],
    chainId: 81224,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.codex.xyz',
        callsPerMinute: 300,
      },
    ],
  },
  proofSystem: undefined,
  dataAvailability: undefined,
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
})
