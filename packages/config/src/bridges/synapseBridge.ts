import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types'

export const synapseBridge: BridgeDescription = {
  name: 'Synapse Bridge',
  slug: 'synapsebridge',
  validation: 'Swap Bridge',
  links: {
    websites: ['https://near.org/bridge/'],
  },
  associatedTokens: ['AURORA'],
  escrows: [
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
}
