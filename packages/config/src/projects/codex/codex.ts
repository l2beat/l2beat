import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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
      repositories: ['https://github.com/Codex-Data'],
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
  proofSystem: {
    type: 'Optimistic',
  },
  dataAvailability: undefined,
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x52759C07A759c81BAab28AE1BE5A19e6450959bD'),
      sinceTimestamp: UnixTime(1728898163),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xa6b1A05a592719B0C8a70c69eac114C48410aDE4'),
      sinceTimestamp: UnixTime(1728898163),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
