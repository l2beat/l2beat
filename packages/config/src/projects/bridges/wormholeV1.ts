import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { Bridge } from '../../types'
import { RISK_VIEW } from './common'

export const wormholeV1: Bridge = {
  type: 'bridge',
  id: ProjectId('wormholeV1'),
  addedAt: new UnixTime(1663149233), // 2022-09-14T09:53:53Z
  isArchived: true,
  display: {
    name: 'Wormhole V1',
    slug: 'wormholev1',
    description: 'First version of the Wormhole bridge.',
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
          // 'HBTC',
          'HUSD',
          'DAI',
          'SRM',
          'WETH',
          'FRAX',
          'WBTC',
        ],
        chain: 'ethereum',
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
