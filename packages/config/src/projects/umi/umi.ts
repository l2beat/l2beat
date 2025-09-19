import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const umi: ScalingProject = upcomingL2({
  id: 'umi',
  capability: 'universal',
  addedAt: UnixTime(1757639162),
  display: {
    name: 'Umi',
    slug: 'umi',
    description:
      "Umi is a Layer 2 solution for Ethereum, enabling developers to deploy Move smart contracts while benefiting from Ethereum's security and liquidity. Built with the modular OP Stack.",
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://uminetwork.com/'],
      bridges: ['https://faucet.uminetwork.com/'],
      documentation: ['https://docs.uminetwork.com/'],
      repositories: ['https://github.com/UmiNetwork'],
      explorers: ['https://devnet.explorer.moved.network'],
      socialMedia: [
        'https://x.com/Umi_Network',
        'https://discord.com/invite/hdhVfxc3X4',
        'https://t.me/uminetwork',
        'https://uminetwork.com/blog',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
