import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const wormholeV1: Bridge = {
  id: ProjectId('wormholeV1'),
  name: 'Wormhole V1',
  slug: 'wormholev1',
  type: 'Lock-Mint',
  destination: ['TODO', 'TODO', 'TODO'],
  canonical: true,
  validation: 'Native Bridge',
  links: {
    websites: ['https://wormhole.com/'],
  },
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
  risks: {
    validation: {
      value: 'External',
      description:
        'Transfers need to be signed offchain by a set of 2/3 of Guardians and then permissionesly relayed to the destination chain.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'No',
      description: '',
    },
    destinationToken: {
      value: 'WrappedToken ',
      description:
        'This token follows Beacon Proxy pattern and can be upgraded by ????',
      sentiment: 'bad',
    },
  },
  connections: [{ network: 'Solana', tokens: ['*'] }],
}
