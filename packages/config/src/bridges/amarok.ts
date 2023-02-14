import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { Bridge } from './types'

export const amarok: Bridge = {
  type: 'bridge',
  id: ProjectId('amarok'),
  display: {
    name: 'Connext Amarok',
    slug: 'amarok',
    description: 'Amarok is a token bridge powered by Connext',
    links: {
      websites: ['https://bridge.connext.network/'],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6'), // Connext main Diamond contract
        sinceTimestamp: new UnixTime(1671625595),
        tokens: ['USDC', 'WETH'],
      },
    ],
  },
  technology: {
    canonical: true,
    category: 'Hybrid',
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
