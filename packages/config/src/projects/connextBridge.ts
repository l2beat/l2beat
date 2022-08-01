import { Project } from './types'
import { bridge } from './types/bridge'

export const connextBridge: Project = bridge({
  name: 'Connext Bridge',
  slug: 'connextbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://bridge.connext.network/'],
  },
  bridges: [
    {
      address: '0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09',
      sinceBlock: 13548432,
      tokens: ['USDC', 'USDT', 'DAI', 'WBTC'],
    },
  ],
  connections: [],
})
