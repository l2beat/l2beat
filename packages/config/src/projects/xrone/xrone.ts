import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const xrone: ScalingProject = underReviewL3({
  id: 'xrone',
  capability: 'universal',
  addedAt: UnixTime(1737469445), // 2025-01-21T14:24:03+00:00
  hostChain: ProjectId('arbitrum'),
  badges: [
    BADGES.RaaS.Caldera,
    BADGES.L3ParentChain.Arbitrum,
    BADGES.DA.DAC,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'XR One',
    slug: 'xrone',
    category: 'Optimium',
    stacks: ['Arbitrum'],
    description:
      "XR One is an Orbit stack L3 with AnyTrust DA built by DeMoN Labs and partnered with Saltwater Games. It is designed to power unique PvP and AI-enhanced applications that spark user's imaginations through mechanics that reward risk-takers.",
    purposes: ['Gaming'],
    links: {
      websites: ['https://saltwatergames.com/'],
      bridges: [],
      documentation: ['https://xr-one.gitbook.io/xr'],
      explorers: ['https://xr1.calderaexplorer.xyz/'],
      socialMedia: [
        'https://x.com/xr_foundation',
        'https://discord.com/invite/W4BdM6N8xb',
        'https://t.me/xrfoundation',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  chainConfig: {
    name: 'xrone',
    chainId: 273,
    gasTokens: ['XR1'],
    apis: [
      {
        type: 'rpc',
        url: 'https://xr1.calderachain.xyz/http',
        callsPerMinute: 1500,
      },
    ],
  },
  // new bridge 0x11549fdea58D9462B059D067031D7BA0508a063F with gas token XR1 (not on CG)
  // https://xr1.hub.caldera.xyz/
})
