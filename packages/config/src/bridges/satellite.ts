import { ProjectId, UnixTime } from '@l2beat/shared'

import { Bridge } from './types'

export const satellite: Bridge = {
  type: 'bridge',
  id: ProjectId('satellite'),
  display: {
    name: 'Satellite (Axelar)',
    slug: 'satellite',
    description: 'Satellite is a token bridge powered by Axelar network',
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
    canonical: true,
    category: 'Liquidity Network',
    destination: ['Various'], // TODO: list the chains
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '2/3 Validators',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'EOA',
      description: '', //TODO: fill
      sentiment: 'bad',
    },
  },
}
