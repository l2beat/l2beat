import { Project } from './types'
import { bridge } from './types/bridge'

export const cBridge: Project = bridge({
  name: 'Celer V2 cBridge',
  slug: 'cbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://hop.exchange/'],
  },
  bridges: [
    {
      address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
      sinceBlock: 13719989,
      tokens: [
        'USDC',
        'WETH',
        'USDT',
        'MASK',
        //'LYRA',
        'BUSD',
        //'THALES',
        //'TORN',
      ],
    },
  ],
})
