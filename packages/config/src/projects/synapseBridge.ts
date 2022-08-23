import { UnixTime } from '@l2beat/types'

import { Project } from './types'
import { bridge } from './types/bridge'

export const synapseBridge: Project = bridge({
  name: 'Synapse Bridge',
  slug: 'synapsebridge',
  purpose: 'Swap Bridge',
  links: {
    websites: ['https://near.org/bridge/'],
  },
  associatedTokens: ['AURORA'],
  bridges: [
    {
      address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
      sinceTimestamp: new UnixTime(1629082107),
      tokens: [
        'ETH',
        'WETH',
        //'gOHM',
        //'HIGH',
        'FRAX',
      ],
    },
  ],
  connections: [],
})
