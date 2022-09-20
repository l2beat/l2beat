import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const orbit: Bridge = {
  id: ProjectId('orbit'),
  name: 'Orbit Bridge',
  slug: 'orbit',
  type: 'Lock-Mint',
  validation: 'Liquidity Network',
  destination: ['KLAYTN'], //TODO: add more chains
  //TODO: Originally for KLAYTN, Orbit Bridge now supports multiple chains and has Liquidity Network
  links: {
    websites: ['https://bridge.orbitchain.io/'],
  },
  risks: {
    validation: {
      value: 'External',
      description: 'MultiSig',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'YES',
      description: '',
      sentiment: 'bad',
    },
    destinationToken: {
      value: 'KToken',
      description: 'Info not available yet',
      sentiment: 'warning',
    },
  },
  escrows: [
    {
      address: '0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a',
      sinceTimestamp: new UnixTime(1603950507),
      tokens: [
        'ETH',
        'USDT',
        // 'ORC',
        'DAI',
        'USDC',
        'WBTC',
        // 'HANDY',
        'MATIC',
      ],
    },
  ],

  connections: [],
}
