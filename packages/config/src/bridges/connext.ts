import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const connext: Bridge = {
  type: 'bridge',
  id: ProjectId('connext'),
  display: {
    name: 'Connext',
    slug: 'connext',
    links: {
      websites: ['https://bridge.connext.network/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09',
        sinceTimestamp: new UnixTime(1636004546),
        tokens: ['USDC', 'USDT', 'DAI', 'WBTC'],
      },
    ],
  },
  technology: {
    category: 'Liquidity Network',
    destination: ['Various'], // TODO: list the chains
  },
}
