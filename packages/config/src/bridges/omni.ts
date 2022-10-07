import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const omni: Bridge = {
  type: 'bridge',
  id: ProjectId('omni'),
  display: {
    name: 'xDai Omni',
    slug: 'omni',
    links: {
      websites: ['https://omni.xdaichain.com/bridge'],
    },
  },
  config: {
    associatedTokens: ['GNO'],
    escrows: [
      {
        address: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        sinceTimestamp: new UnixTime(1596501090),
        tokens: [
          'GNO',
          //'NODE',
          //'DXD',
          //'HOPR',
          //'BRIGHT'
        ],
      },
    ],
  },
  technology: {
    category: 'Lock-Mint',
    destination: ['Gnosis Chain'],
  },
  riskView: {
    validation: {
      value: 'Native Bridge',
      description: 'TODO',
    },
  },
}
