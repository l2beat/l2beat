import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

export const davos: Bridge = {
  type: 'bridge',
  id: ProjectId('davos'),
  addedAt: UnixTime(1710858245), // 2024-03-19T14:24:05Z
  reviewStatus: 'inReview',
  display: {
    name: 'Davos',
    slug: 'davos',
    category: 'Token Bridge',
    links: {
      websites: ['https://davos.xyz/app/bridge'],
      documentation: ['https://docs.davos.xyz/'],
      repositories: ['https://github.com/davos-money/davos-contracts'],
      socialMedia: [
        'https://twitter.com/Davos_Protocol',
        'https://t.me/davosprotocol',
        'https://discord.gg/davos-protocol-978896437612019722',
        'https://medium.com/@Davos_Protocol',
        'https://linkedin.com/company/davosprotocol',
      ],
    },
    description:
      'Davos bridge is a multi-chain token bridge that allows users to transfer DUSD between different blockchains. It burns the original tokens and mints new ones on the destination chain.',
  },
  config: {
    escrows: [
      // no escrows due to burn and mint
      {
        address: EthereumAddress('0x6DeF4570251E1f435E121b3Ee47174496D851C99'),
        sinceTimestamp: UnixTime(1685433000),
        tokens: [],
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
      'Polygon',
      'Linea',
      'BNB Chain',
      'Polygon zkEVM',
    ],
  },
  discoveryInfo: getDiscoveryInfo([]),
}
