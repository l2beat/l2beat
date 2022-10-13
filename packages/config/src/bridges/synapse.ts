import { ProjectId, UnixTime } from '@l2beat/types'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const synapse: Bridge = {
  type: 'bridge',
  id: ProjectId('synapse'),
  display: {
    name: 'Synapse',
    slug: 'synapse',
    links: {
      websites: ['https://synapseprotocol.com/'],
    },
  },
  config: {
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
  },
  technology: {
    category: 'Liquidity Network',
    destination: ['Various'], // TODO: list the chains
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Transfers out of the bridge are validated by EOA.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: '3 hour delay',
      description:
        'Bridge can be upgraded after 3 hour delay by a 2/3 Admin MultiSig.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
}
