import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const rarimo: ScalingProject = underReviewL2({
  id: 'rarimo',
  capability: 'universal',
  addedAt: UnixTime(1743429855), // 31 March 2025 14:04:15
  display: {
    name: 'Rarimo',
    slug: 'rarimo',
    category: 'ZK Rollup',
    description:
      "Rarimo is building a permissionless ZK Registry that is a ZK Rollup. It enables proving the system's state without revealing details about individual statements and redefines how identities, interactions, and social graphs are managed.",
    purposes: ['Universal', 'Privacy'],
    links: {
      websites: ['https://rarimo.com/'],
      bridges: ['https://l2bridge.rarimo.com/'],
      explorers: ['https://scan.rarimo.com/'],
      socialMedia: [
        'https://t.me/+pWugh5xgDiE3Y2Jk',
        'https://x.com/Rarimo_protocol',
      ],
    },
  },
  chainConfig: {
    name: 'rarimo',
    chainId: 7368,
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'rpc',
        url: 'https://l2.rarimo.com',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x2F3c205613d9451f88E19E011ED23775afe00C41'),
      sinceTimestamp: UnixTime(1741046400),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
