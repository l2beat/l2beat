import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const satellite: Bridge = {
  id: ProjectId('satellite'),
  display: {
    name: 'Satellite Bridge',
    slug: 'satellite',
    description: 'Satellite is a token bridge powered by AxlerR network',
    links: {
      websites: ['https://satellite.money/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x4F4495243837681061C4743b74B3eEdf548D56A5', // AxerlR Gateway
        sinceTimestamp: new UnixTime(1634135918),
        tokens: [
          'USDC',
          'WBTC',
          'WETH',
          'USDT',
          'DAI',
          'LINK',
          'FRAX',
          'MKR',
          'UNI', //TODO: Add more tokens
        ],
      },
    ],
  },
  technology: {
    validation: 'EV Bridge',
    canonical: true,
    type: 'Lock-Mint OR Swap',
    destination: ['Multichain'],
    connections: [{ network: 'Multichain', tokens: ['*'] }],
  },
  riskView: {
    validation: {
      value: 'External',
      description: '2/3 Validators',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'EOA',
      description: '', //TODO: fill
      sentiment: 'bad',
    },
    destinationToken: {
      value: '???',
      description: 'Info not available yet',
      sentiment: 'warning',
    },
  },
}
