import { UnixTime } from '@l2beat/types'

import { Project } from './types'
import { bridge } from './types/bridge'

export const gravityBridge: Project = bridge({
  name: 'Gravity Bridge',
  slug: 'gravitybridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://bridge.roninchain.com/'],
  },
  bridges: [
    {
      address: '0xa4108aA1Ec4967F8b52220a4f7e94A8201F2D906',
      sinceTimestamp: new UnixTime(1639416372),
      tokens: ['USDC', 'WETH', 'DAI'],
    },
  ],
  connections: [],
})
