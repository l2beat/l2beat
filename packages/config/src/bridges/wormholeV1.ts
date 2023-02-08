import { ProjectId, UnixTime } from '@l2beat/shared'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const wormholeV1: Bridge = {
  type: 'bridge',
  id: ProjectId('wormholeV1'),
  display: {
    name: 'Wormhole V1',
    slug: 'wormholev1',
    links: {
      websites: ['https://wormhole.com/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0xf92cD566Ea4864356C5491c177A430C222d7e678', // Escrow to Solana ?
        sinceTimestamp: new UnixTime(1611084766),
        tokens: [
          //'FTT',
          'BUSD',
          'HBTC',
          'HUSD',
          'DAI',
          'SRM',
          'WETH',
          'FRAX',
          'WBTC',
        ],
      },
    ],
  },
  technology: {
    category: 'Token Bridge',
    destination: ['Various'], // TODO: list the chains
    canonical: true,
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be signed offchain by a set of 2/3 of Guardians and then in a permissionless way relayed to the destination chain.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'No',
      description: '',
    },
    destinationToken: RISK_VIEW.WRAPPED,
  },
}
