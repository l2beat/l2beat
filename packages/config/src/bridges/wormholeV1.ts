import { EthereumAddress,SolanaAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const wormholeV1: Bridge = {
  type: 'bridge',
  id: ProjectId('wormholeV1'),
  isArchived: true,
  display: {
    name: 'Wormhole',
    slug: 'wormhole',
    links: {
      websites: ['https://wormhole.com/'],
    },
    category: 'Token Bridge',' Messaging bridge'
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xf92cD566Ea4864356C5491c177A430C222d7e678'),
        address: SolanaAddress('worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth')
        sinceTimestamp: new UnixTime(1611084766),
        tokens: [
          //'USDC',
          'WormholeETH',
          'USDCnet',
          'USDTnet'
          'Bonk',
          'BUSD',
          'HBTC',
          'HUSD',
          'DAI',
          'WETH',
          'FRAX',
          'WBTC',
          'tBTC'
        ],
      },
    ],
  },
  technology: {
    destination: ['Solana','Binance Smart Chain','Terra and Terra Classic','Polygon','Avalanche','Algorand','Fantom','Karura','Celo,'Acala','Aptos','Arbitrum'
], 
    canonical: true,
  },
  riskView: {
    validatedBy: {
      value: 'Network of permissioned Nodes',
      description:
        'Transfers need to be signed offchain by a set of 2/3n +1 of Guardians and then relayed to the destination chain with the relayers, as of now there are no open public relayers but anyone spin up their own.',
      sentiment: 'bad',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.WRAPPED,
  },
}
