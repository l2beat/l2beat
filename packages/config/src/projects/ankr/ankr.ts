import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

export const ankr: Bridge = {
  type: 'bridge',
  id: ProjectId('ankr'),
  addedAt: UnixTime(1710858245), // 2024-03-19T14:24:05Z
  reviewStatus: 'inReview',
  display: {
    name: 'Ankr',
    slug: 'ankr',
    category: 'Token Bridge',
    links: {
      websites: ['https://ankr.com/staking/bridge/'],
      documentation: ['https://ankr.com/docs/bridge/overview/'],
      repositories: ['https://github.com/Ankr-network'],
      socialMedia: [
        'https://twitter.com/ankrstaking',
        'https://t.me/ankrstaking',
        'https://discord.com/invite/GGzJ6A6fEg',
        'https://medium.com/ankr-network',
      ],
    },
    description:
      'Ankr Bridge allows you to transfer Ankr Liquid Staking tokens between networks where while remaining a valid stake and continuing to accumulate rewards.',
  },
  config: {
    associatedTokens: ['ANKR'],
    escrows: [
      {
        address: EthereumAddress('0xc437DF90B37C1dB6657339E31BfE54627f0e7181'),
        sinceTimestamp: UnixTime(1646203700),
        tokens: ['ANKR', 'ankrETH', 'ankrPOL'],
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'A withdrawal requires a proof signed by an admin-defined consensus EOA.',
      sentiment: 'bad',
    },
  },
  technology: {
    destination: [
      'Arbitrum',
      'Avalanche',
      'Optimism',
      'Fantom',
      'Polygon',
      'Mode',
    ],
  },
  discoveryInfo: getDiscoveryInfo([]),
}
