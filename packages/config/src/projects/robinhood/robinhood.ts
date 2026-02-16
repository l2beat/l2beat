import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const robinhood: ScalingProject = upcomingL2({
  id: 'robinhood',
  capability: 'universal',
  addedAt: UnixTime(1759624683),
  hasTestnet: true,
  display: {
    name: 'Robinhood Chain',
    slug: 'robinhood-chain',
    description:
      'Robinhood Chain is a permissionless Layer 2 blockchain built for financial services and tokenized real-world assets. It uses the Arbitrum Orbit stack.',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://robinhood.com/eu/en/chain/'],
      bridges: ['https://testnet.bridge.intuition.systems'],
      documentation: ['https://docs.robinhood.com/chain'],
      repositories: [],
      explorers: ['https://explorer.testnet.chain.robinhood.com/stats'],
      socialMedia: [
        'https://x.com/RobinhoodApp'
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
