import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const rufus: ScalingProject = underReviewL2({
  id: 'rufus',
  capability: 'universal',
  addedAt: UnixTime(1737636288), // 2025-01-23T12:44:48+00:00
  badges: [
    BADGES.RaaS.Caldera,
    BADGES.DA.DAC,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'Rufus',
    slug: 'rufus',
    stacks: ['Arbitrum'],
    description:
      'Rufus is an Orbit stack L2 with AnyTrust DA created for gaming by the team behind the Dogelon (ELON) token.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://dogelonmars.com/'],
      bridges: ['https://rufus.bridge.caldera.xyz/'],
      documentation: ['https://docs.dogelonmars.com'],
      explorers: ['https://rufus.calderaexplorer.xyz/'],
      socialMedia: [
        'https://x.com/dogelonmars',
        'https://dogelonmars.com/blog',
        'https://t.me/DogelonMars',
        'https://discord.gg/dogelonmars',
        'https://reddit.com/r/dogelon/',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  associatedTokens: ['ELON'],
  chainConfig: {
    name: 'rufus',
    gasTokens: ['ELON'],
    chainId: 2420,
    apis: [
      {
        type: 'rpc',
        url: 'https://rufus.calderachain.xyz/http',
        callsPerMinute: 300,
      },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x0E1a60c49b3aAABa3313918f63F6CC6c55746B17'), // bridge
      sinceTimestamp: UnixTime(1733961947),
      tokens: ['ELON'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x7F6300B8d3be27aAe2c7b5f9B5dB95152279D926'), // standardGW
      sinceTimestamp: UnixTime(1733961983),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
