import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types'

export const connextBridge: BridgeDescription = {
  name: 'Connext Bridge',
  slug: 'connextbridge',
  validation: 'Native Bridge',
  links: {
    websites: ['https://bridge.connext.network/'],
  },
  escrows: [
    {
      address: '0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09',
      sinceTimestamp: new UnixTime(1636004546),
      tokens: ['USDC', 'USDT', 'DAI', 'WBTC'],
    },
  ],
  connections: [],
}
