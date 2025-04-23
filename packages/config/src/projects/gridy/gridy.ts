import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

// bridge escrow on starknet: https://voyager.online/contract/0x07097daccd81703fda310085861e6d55f6c7625329b11aafacc3bb52916cac2a

export const gridy: ScalingProject = underReviewL3({
  id: ProjectId('gridy'),
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
    stack: 'SN Stack',
    description:
      'Gridy is a lightning-fast onchain treasure hunt forged on a Layer 3 on SN Stack, turning every click into a dig site where diamonds and jackpot gems fire real-time autonomous transactions toward a massive USDC prize pool.',
    purposes: ['Gaming'],
    category: 'Validium',
    links: {
      websites: ['https://gridy.karnot.xyz/'],
      socialMedia: ['https://twitter.com/karnotxyz'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('starknet'),
  },
})
