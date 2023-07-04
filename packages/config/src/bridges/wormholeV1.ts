import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const wormholeV1: Bridge = {
  type: 'bridge',
  id: ProjectId('wormholeV1'),
  isArchived: true,
  display: {
    name: 'Wormhole V1',
    slug: 'wormholev1',
    links: {
      websites: ['https://wormhole.com/'],
    },
    category: 'Token Bridge',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xf92cD566Ea4864356C5491c177A430C222d7e678'), // Escrow to Solana ?
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
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.WRAPPED,
  },
}
