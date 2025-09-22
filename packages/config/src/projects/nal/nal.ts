import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const nal: ScalingProject = underReviewL2({
  id: 'nal',
  capability: 'universal',
  addedAt: UnixTime(1726499832), // 2024-09-16T15:17:12Z
  archivedAt: UnixTime(1741046400), // 2025-03-04T00:00:00.000Z,
  display: {
    name: 'Nal',
    slug: 'nal',
    stacks: ['OP Stack'],
    description:
      'Nal is a general-purpose OP stack chain. It aims to facilitate the creation and trading of new assets, including AIGC and physical-to-digital transformations.',
    purposes: ['Universal'],
    links: {
      websites: ['https://nal.network/#/home'],
      bridges: [], //https://bridge.nal.network/deposit for testnet, no mainnet bridge UI is available yet
      documentation: ['https://docs.nal.network/chain/Overview.html'],
      explorers: ['https://scan.nal.network/'],
      socialMedia: ['https://x.com/nal_network'],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  chainConfig: {
    name: 'nal',
    chainId: 328527,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.nal.network/',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x8a471dF117E2fEA79DACE93cF5f6dd4217931Db7'),
      sinceTimestamp: UnixTime(1719457200),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
