import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const powerloom: ScalingProject = underReviewL2({
  id: 'powerloom',
  capability: 'universal',
  addedAt: UnixTime(1741768931),
  display: {
    name: 'Powerloom',
    slug: 'powerloom',
    description:
      'Powerloom Mainnet is the Layer-2 chain supporting Powerloom’s composable data network where devs, orgs, and end-users get access to ready-to-consume, affordable, and verifiable onchain datasets.',
    purposes: ['Universal'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://powerloom.io/'],
      bridges: ['https://bridge-v2.powerloom.network/'],
      documentation: ['https://docs.powerloom.io/'],
      explorers: ['https://explorer.powerloom.network/'],
      repositories: ['https://github.com/powerLoom'],
      socialMedia: [
        'https://x.com/powerloom',
        'https://t.me/PowerLoomProtocol',
        'https://linkedin.com/company/powerloom/',
        'https://youtube.com/@powerloom',
        'https://discord.com/invite/powerloom',
      ],
    },
  },
  associatedTokens: ['POWER'],
  chainConfig: {
    name: 'powerloom',
    gasTokens: ['POWER'],
    chainId: 7869,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-v2.powerloom.network',
        callsPerMinute: 1500,
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
      address: EthereumAddress('0x53b168016aA2E3469B5D76315311aAC4Ce0020DB'), // bridge
      sinceTimestamp: UnixTime(1741768931),
      tokens: ['POWER'],
      chain: 'ethereum',
    },
  ],
})
