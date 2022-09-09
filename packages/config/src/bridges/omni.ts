import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const omni: Bridge = {
  id: ProjectId('omni'),
  name: 'xDai Omni',
  slug: 'omni',
  validation: 'Native Bridge',
  links: {
    websites: ['https://omni.xdaichain.com/bridge'],
  },
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
    {
      address: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016',
      sinceTimestamp: new UnixTime(1596501090),
      tokens: ['cDAI', 'DAI'],
    },
  ],
  connections: [],
}
