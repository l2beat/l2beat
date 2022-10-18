import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const cBridge: Bridge = {
  type: 'bridge',
  id: ProjectId('cbridge'),
  display: {
    name: 'cBridge V2',
    slug: 'cbridge',
    description:
      'Celer is a general messaging bridge, token-bridge and a liquidity network that leverages the "state-guardian" aka SGN thats operated by validators runnning on tendermint engine to perform cross-chain transactions.',
    links: {
      websites: ['https://www.celer.network/'],
      apps: ['https://cbridge.celer.network/'],
      explorers: ['https://cbridge-analytics.celer.network/'],
      documentation: ['https://cbridge-docs.celer.network/'],
      repositories: ['https://github.com/celer-network'],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
        sinceTimestamp: new UnixTime(1638346811),
        tokens: ['USDC', 'WETH', 'USDT', 'MASK', 'BUSD'],
      },
    ],
  },
  technology: {
    category: 'Token Bridge',
    destination: ['Various'], // TODO: list the chains
  },
}
