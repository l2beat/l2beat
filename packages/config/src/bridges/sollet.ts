import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const sollet: Bridge = {
  type: 'bridge',
  id: ProjectId('sollet'),
  display: {
    name: 'Sollet Sol',
    slug: 'sollet',
    description:
      'Externally Validated bridge to Solana that is now being phased out - users are encouraged to use Wormhole instead.',
    links: {
      websites: ['https://www.sollet.io/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0xeae57ce9cc1984F202e15e038B964bb8bdF7229a',
        sinceTimestamp: new UnixTime(1599794859),
        tokens: [
          'ETH',
          //'ALEPH',
          'USDT',
          'USDC',
          'UNI',
          'KEEP',
          'LINK',
        ],
      },
    ],
  },
  technology: {
    category: 'Lock-Mint',
    destination: ['Solana'],
  },
  riskView: {
    validation: {
      value: 'External',
      description: 'TODO',
    },
  },
}
