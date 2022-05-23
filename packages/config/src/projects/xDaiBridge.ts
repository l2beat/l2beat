import { Project } from './types'
import { bridge } from './types/bridge'

export const xDaiBridge: Project = bridge({
  name: 'xDai Omni Bridge',
  slug: 'xdaibridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://omni.xdaichain.com/bridge'],
  },
  associatedTokens: ['GNO'],
  bridges: [
    {
      address: '0x88ad09518695c6c3712AC10a214bE5109a655671',
      sinceBlock: 10590093,
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
      sinceBlock: 10590093, // NOT FULL HISTORY
      tokens: ['cDAI', 'DAI'],
    },
  ],
  connections: [],
})
