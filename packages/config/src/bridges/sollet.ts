import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const sollet: Bridge = {
  id: ProjectId('sollet'),
  name: 'Sollet Sol',
  slug: 'sollet',
  type: 'Lock-Mint',
  destination: ['Solana'],

  description:
    'Externally Validated bridge to Solana that is now being phased out - users are encouraged to use Wormhole instead.',
  validation: 'EV Token Bridge',
  links: {
    websites: ['https://www.sollet.io/'],
  },
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
  connections: [{ network: 'Solana', tokens: ['*'] }],
}
