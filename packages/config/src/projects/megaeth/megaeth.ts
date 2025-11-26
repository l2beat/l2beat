import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

const discovery = new ProjectDiscovery('megaeth')

export const megaeth: ScalingProject = underReviewL2({
  id: 'megaeth',
  capability: 'universal',
  addedAt: UnixTime(1764143601),
  display: {
    name: 'Megaeth',
    slug: 'megaeth',
    description:
      'MegaETH is developing a real-time blockchain based on the OP stack architecture and the Kailua proof system. Where crypto applications leverage extreme performance to reach their full potential.',
    purposes: ['Universal'],
    links: {
      websites: ['https://megaeth.com/'],
      bridges: ['https://predeposit.megaeth.com/'],
      documentation: ['https://docs.megaeth.com/'],
      explorers: ['https://megaexplorer.xyz/'],
      repositories: ['https://github.com/megaeth-labs'],
      socialMedia: [
        'https://x.com/megaeth',
        'https://discord.com/invite/megaeth',
        'https://t.me/megaeth_labs',
        'https://megaeth.com/blog-news',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  escrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6',
      ),
      tokens: ['USDC'],
      description:
        'Predeposit escrow for USDC that can only be deposited to after passing KYC and only be withdrawn to a single address.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719',
      ),
      tokens: ['USDC'],
      description: "Multisig currently designated as the 'Treasury'.",
    }),
  ],
})
