import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const synapse: Bridge = {
  id: ProjectId('synapse'),
  name: 'Synapse',
  slug: 'synapse',
  type: 'Lock-Mint OR Swap',
  validation: 'Swap Bridge',
  destination: ['TODO', 'TODO', 'TODO'],

  links: {
    websites: ['https://synapseprotocol.com/'],
  },

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
  risks: {
    validation: {
      value: 'External',
      description: 'Transfers out of the bridge are validated by EOA.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: '3 hour delay',
      description:
        'Bridge can be upgraded after 3 hour delay by a 2/3 Admin MultiSig.',
      sentiment: 'bad',
    },
    destinationToken: {
      value: 'SynapseERC20',
      description: 'Info not available yet',
      sentiment: 'warning',
    },
  },
  connections: [],
}
