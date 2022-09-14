import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const near: Bridge = {
  id: ProjectId('near'),
  name: 'Rainbow Bridge',
  slug: 'near',
  canonical: true,
  type: 'Lock-Mint',
  validation: 'LC Token Bridge',
  destination: ['Near', 'Aurora'],
  links: {
    websites: ['https://near.org/bridge/'],
  },
  associatedTokens: ['AURORA'],
  escrows: [
    {
      address: '0x23Ddd3e3692d1861Ed57EDE224608875809e127f',
      sinceTimestamp: new UnixTime(1615826693),
      tokens: [
        'DAI',
        'USDC',
        'AURORA',
        'USDT',
        'WBTC',
        // PLY,
        // OCT
      ],
    },
  ],
  risks: {
    validation: {
      value: 'Light Client',
      description:
        'Transfers out of the bridge are validated using Optimistic Light Client of Near Chain on Ethereum. Transfers into NEAR are validated by Ethereum light client on NEAR side.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'YES',
      description:
        'Bridge cannot be upgraded but 3/6 Admin Multisig can move all funds out of the bridge via admin functions with no warning.',
      sentiment: 'bad',
    },
    destinationToken: {
      value: '???',
      description: 'Info not available yet',
      sentiment: 'warning',
    },
  },
  connections: [],
}
