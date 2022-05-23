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
      sinceBlock: 10838129,
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
