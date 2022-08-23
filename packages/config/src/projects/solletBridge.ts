import { UnixTime } from '@l2beat/types'

import { Project } from './types'
import { bridge } from './types/bridge'

export const solletBridge: Project = bridge({
  name: 'Sollet Sol Bridge',
  slug: 'solletbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://www.sollet.io/'],
  },
  bridges: [
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
  connections: [],
})
