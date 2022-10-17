import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const orbiter: Bridge = {
  type: 'bridge',
  id: ProjectId('orbiter'),
  display: {
    name: 'Orbiter',
    slug: 'orbiter',
    links: {
      websites: ['https://orbiter.finance/'],
    },
  },
  config: {
    // In Orbiter the escrows are EOAs
    escrows: [
      {
        address: '0x80C67432656d59144cEFf962E8fAF8926599bCF8',
        sinceTimestamp: new UnixTime(1649170157),
        tokens: ['ETH'],
      },
      {
        address: '0x41d3D33156aE7c62c094AAe2995003aE63f587B3',
        sinceTimestamp: new UnixTime(1635067681),
        tokens: ['USDC'],
      },
      {
        address: '0xd7Aa9ba6cAAC7b0436c91396f22ca5a7F31664fC',
        sinceTimestamp: new UnixTime(1654853887),
        tokens: ['USDT'],
      },
      {
        address: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
        sinceTimestamp: new UnixTime(1649661119),
        tokens: ['ETH'],
      },
    ],
  },
  technology: {
    category: 'Liquidity Network',
    destination: [
      'zkSync',
      'Polygon',
      'Arbitrum One',
      'Arbitrum Nova',
      'Loopring',
      'Optimism',
      'zkSpace',
      'Boba',
      'ImmutibleX',
      'StarkNet',
      'BSC',
      'Metis',
      'dYdX',
    ],
  },
}
