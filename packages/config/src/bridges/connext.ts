import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const connext: Bridge = {
  type: 'bridge',
  id: ProjectId('connext'),
  display: {
    name: 'Connext',
    slug: 'connext',
    links: {
      websites: [
        'https://bridge.connext.network/',
        'https://www.connext.network/',
      ],
      apps: ['https://bridge.connext.network/'],
      explorers: ['https://connextscan.io/'],
      socialMedia: [
        'http://twitter.com/connextnetwork',
        'https://discord.gg/pm4TPr4w5g',
      ],
      documentation: ['https://docs.connext.network/'],
      repositories: ['https://github.com/CoinHippo-Labs/connext-bridge'],
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
