import { Project } from './types'
import { bridge } from './types/bridge'

export const roninBridge: Project = bridge({
  name: 'Ronin Bridge',
  slug: 'roninbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://bridge.roninchain.com/'],
  },
  associatedTokens: ['AXS'],
  bridges: [
    {
      address: '0x1A2a1c938CE3eC39b6D47113c7955bAa9DD454F2',
      sinceBlock: 11724674 ,
      tokens: ['ETH', 'AXS', 'WETH', 'USDC', 'USDT', 'MATIC', 'LINK'],
    },
  ],
})
