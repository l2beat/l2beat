import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const nomad: Bridge = {
  type: 'bridge',
  id: ProjectId('nomad'),
  display: {
    name: 'Nomad',
    slug: 'nomad',
    links: {
      websites: ['https://app.nomad.xyz/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3',
        sinceTimestamp: new UnixTime(1641899423),
        tokens: [
          'USDC',
          'FRAX',
          //'IAG',
          'WETH',
          'USDT',
          'WBTC',
          'DAI',
          //'CQT',
          'FXS',
        ],
      },
    ],
  },
  technology: {
    category: 'Lock-Mint',
    destination: ['TODO', 'TODO', 'TODO'],
  },
  riskView: {
    validation: {
      value: 'Optimistic Bridge',
      description: 'TODO',
    },
  },
  contracts: {
    addresses: [
      {
        address: '0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3',
        name: 'BridgeRouter',
        description: 'Nomad Bridge Router.',
        upgradeability: {
          type: 'Beacon',
          beacon: '0xB70588b1A51F847d13158ff18E9Cac861dF5Fb00',
          beaconAdmin: '0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e',
          implementation: '0x15fdA9F60310d09FEA54E3c99d1197DfF5107248',
        },
      },
    ],
    risks: [],
  },
}
