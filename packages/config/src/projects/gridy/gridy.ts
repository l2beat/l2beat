import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

// bridge escrow on starknet: https://voyager.online/contract/0x07097daccd81703fda310085861e6d55f6c7625329b11aafacc3bb52916cac2a

export const gridy: ScalingProject = underReviewL3({
  id: ProjectId('gridy'),
  archivedAt: UnixTime(1747648277), // 2025-05-19T09:51:17
  capability: 'appchain',
  addedAt: UnixTime(1745041853), // 2025-04-19T05:50:53Z
  hostChain: ProjectId('starknet'),
  badges: [
    BADGES.VM.CairoVM,
    BADGES.Stack.SNStack,
    BADGES.Infra.SHARP,
    BADGES.RaaS.Karnot,
  ],
  display: {
    name: 'Gridy',
    slug: 'gridy',
    stacks: ['SN Stack'],
    description:
      'Gridy is a lightning-fast onchain treasure hunt forged on a Layer 3 on SN Stack, turning every click into a dig site where diamonds and jackpot gems fire real-time autonomous transactions toward a massive USDC prize pool.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://karnot.xyz/'],
      socialMedia: ['https://twitter.com/karnotxyz'],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Validity',
  },
  chainConfig: {
    name: 'gridy',
    chainId: undefined,
    apis: [
      {
        type: 'starknet',
        url: 'https://replace.me',
        callsPerMinute: 600,
      },
    ],
  },
  activityConfig: {
    type: 'block',
  },
})
