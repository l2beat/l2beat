import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const acrossV2: Bridge = {
  type: 'bridge',
  id: ProjectId('across-v2'),
  display: {
    name: 'Across V2',
    slug: 'acrossv2',
    links: {
      websites: ['https://across.to/'],
      apps: ['https://across.to/'],
      repositories: ['https://github.com/across-protocol/contracts-v2'],
      socialMedia: [
        'https://twitter.com/AcrossProtocol',
        'https://discord.gg/across',
        'https://medium.com/across-protocol',
        'https://forum.across.to/'
      ]
    },
    description:
      'Across V2 is a cross-chain optimistic bridge that uses actors called Relayers to fulfill user requests on the destination chain. Relayers are later reimbursed by providing a proof of their action to an Optimistic Oracle on Ethereum. The architecture uses multiple pools for user deposits and liquidity providers that are rebalanced using native bridges.'
  },
  config: {
    escrows: [
      {
        address: '0xc186fA914353c44b2E33eBE05f21846F1048bEda', 
        sinceTimestamp: new UnixTime(1653124620),
        tokens: [
          'USDC',
          'WETH',
          'WBTC',
          'DAI',
          'BAL',
          'UMA',
          'BOBA',
          'USDT',
        ],
      },
    ],
  },
  technology: {
    category: 'Relayer Swap',
    destination: ['Optimism', 'Polygon', 'Boba', 'Arbitrum']
  },
  riskView: {
    validation: {
      value: 'Optimistic Bridge',
      description: 'Optimistic Oracle on Ethereum is used to reimburse Relayers who prove fulfilling user request on the destination chain.',
    },
  },
}
