import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

// A static entry that exists to carry the CROPS evaluation into the garden. The
// discovery-driven version of this project (detailed description, contracts,
// permissions, discovered values) is being added separately - when it lands,
// move the `crops` block below into it and delete this file. Values that the
// discovery-driven version reads from chain are inlined here instead:
// the Timelock delay (2d), the enabled fee tiers, and the protocol fee schedule.
export const uniswapv3: BaseProject = {
  id: ProjectId('uniswapv3'),
  slug: 'uniswapv3',
  name: 'Uniswap V3',
  shortName: undefined,
  addedAt: UnixTime(0),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Uniswap v3 is a concentrated-liquidity AMM where anyone can deploy an immutable, adminless pool for any token pair at an enabled fee tier. User funds sit only in the pools, which no one can upgrade or pause. UNI tokenholder governance, acting through a 2-day timelock, holds two bounded control powers over v3 pools: enabling new fee tiers and setting a protocol fee capped at 1/4 of LP fees per side. Under the current UNIfication configuration, collected protocol fees are exchanged by the Firepit for UNI sent permanently to 0xdead; governance can change this disposal path after the timelock.',
    links: {
      websites: ['https://app.uniswap.org/'],
      documentation: ['https://docs.uniswap.org/contracts/v3/overview'],
      repositories: ['https://github.com/Uniswap/v3-core'],
      socialMedia: ['https://x.com/Uniswap'],
    },
    references: [
      {
        title: 'Uniswap v3 Core Whitepaper',
        url: 'https://app.uniswap.org/whitepaper-v3.pdf',
      },
      {
        title: 'UNIfication proposal (protocol fees & UNI burn)',
        url: 'https://vote.uniswapfoundation.org/proposals/93',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'DEX',
  },
  // Declared empty on purpose: v3 has no oracle, no bridge, no external
  // contract its operation depends on.
  externalDependencies: [],
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      description:
        'Pools are immutable and adminless: anyone can deploy a pool for any token pair at an enabled fee tier, and swapping or withdrawing liquidity needs no permission and passes through no operator. Nothing can be paused or upgraded. UNI tokenholder governance, acting through a 2d timelock, holds only two bounded powers over v3 pools - enabling new fee tiers and setting a protocol fee capped at 1/4 of LP fees per side - so it cannot block a swap, freeze a position, or reach LP funds.',
    },
    openSource: {
      sentiment: 'good',
      description:
        'The v3 core and periphery contracts are GPL licensed - the business-source grant on the core expired in 2023 - verified onchain, and can be built and run locally alongside a self-hosted interface.',
    },
    privacy: {
      status: 'notReviewed',
    },
    security: {
      sentiment: 'good',
      description:
        'Every contract that holds or routes user funds is immutable, with no upgrade path and no external dependency - no oracle, no bridge - and the core has been battle-tested at very high volume since 2021. What remains is a governance-set protocol fee (currently 1/4 of LP fees per side, 1/6 on the 0.3% tier, with proceeds burned as UNI through the Firepit), per-pool token and liquidity risk, and the router and approval contracts that sit outside the pools.',
    },
  },
}
