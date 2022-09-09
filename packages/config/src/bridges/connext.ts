import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const connext: Bridge = {
  id: ProjectId('connext'),
  name: 'Connext',
  slug: 'connext',
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
