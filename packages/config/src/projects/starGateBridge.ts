import { Project } from './types'
import { bridge } from './types/bridge'

export const starGateBridge: Project = bridge({
  name: 'StarGate Bridge',
  slug: 'stargatebridge',
  purpose: 'Swap Bridge',
  links: {
    websites: ['https://stargate.finance/'],
  },
  bridges: [
    {
      address: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
      sinceBlock: 14403393 ,
      tokens: ['USDC'],
    },
    {
      address: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
      sinceBlock: 14403402 ,
      tokens: ['USDT'],
    },
  ],
})
