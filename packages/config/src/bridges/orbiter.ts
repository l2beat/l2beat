import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const orbiter: Bridge = {
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
    ],
  },
  technology: {
    type: 'Lock-Mint',
    destination: ['TODO', 'TODO', 'TODO'],
  },
  riskView: {
    validation: {
      value: 'Liquidity Network',
      description: 'TODO',
    },
  },
}
