import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const wormhole: Bridge = {
  type: 'bridge',
  id: ProjectId('wormhole'),
  display: {
    name: 'Wormhole V2',
    slug: 'wormhole',
    links: {
      websites: ['https://wormhole.com/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585', // Escrows to various chains
        sinceTimestamp: new UnixTime(1631535967),
        tokens: [
          'WETH',
          //'NEXM',
          //'XCN',
          'USDT',
          'USDC',
          'HUSD',
          'BUSD',
          'LINK',
          'SRM',
          'SUSHI',
          'UNI',
          'LDO',
          'DAI',
          //'stETH',
        ],
      },
    ],
  },
  technology: {
    category: 'Lock-Mint',
    destination: ['TODO', 'TODO', 'TODO'],
    canonical: true,
  },
  riskView: {
    validation: {
      value: 'External',
      description:
        'Transfers need to be signed offchain by a set of 2/3 of Guardians and then permissionesly relayed to the destination chain.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'YES',
      description: 'The bridge can be upgraded by ???',
      sentiment: 'bad',
    },
    destinationToken: {
      value: 'WrappedToken ',
      description:
        'This token follows Beacon Proxy pattern and can be upgraded by ????',
      sentiment: 'bad',
    },
  },
}
