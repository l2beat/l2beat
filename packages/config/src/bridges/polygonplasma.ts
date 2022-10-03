import { ProjectId, UnixTime } from '@l2beat/types'

import { polygonpos } from './polygonpos'
import { Bridge } from './types'

export const polygonplasma: Bridge = {
  type: 'bridge',
  id: ProjectId('polygon-plasma'),
  display: {
    name: 'Polygon "Plasma"',
    slug: 'polygon-plasma',
    links: polygonpos.display.links,
    description:
      'Polygon PoS it the official bridge provided by the Polygon team to bridge assets from Ethereum to Polygon chain. The bridge is validated by Polygon validators and allows for asset as well as data movement between Polygon and Ethereum.',
  },
  config: {
    associatedTokens: ['MATIC'],
    escrows: [
      {
        address: '0x401F6c983eA34274ec46f84D70b31C151321188b',
        sinceTimestamp: new UnixTime(1590850640),
        tokens: ['MATIC', 'DAI'],
      },
    ],
  },
  riskView: {
    validation: {
      value: 'Light Client',
      description:
        'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: '2 day delay',
      description: 'The bridge can be upgraded by x/y MSig after 2 day delay',
      sentiment: 'warning',
    },
    destinationToken: {
      value: 'UChildERC20Proxy',
      description: 'This token can be upgraded if Proxy owner is not set to 0x',
      sentiment: 'bad',
    },
  },
  technology: {
    destination: ['Polygon'],
    canonical: true,
    category: 'Lock-Mint',
    principleOfOperation: {
      // TODO: this is a temporary entry
      name: 'Principle of operation',
      description:
        'How the bridge works. Who sends money where. Maybe we want an image in this section.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      // TODO: this is a temporary entry
      name: 'Transfers are verified by a light client',
      description:
        'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
    destinationToken: {
      // TODO: this is a temporary entry
      name: 'Destination tokens are upgradeable',
      description:
        'This token can be upgraded if Proxy owner is not set to 0x.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
  },
  contracts: {
    // TODO: this is a temporary entry
    addresses: [
      {
        address: '0x401F6c983eA34274ec46f84D70b31C151321188b',
        name: 'Escrow for MATIC and DAI',
        description: 'All MATIC and DAI go here.',
      },
    ],
    risks: [],
  },
  permissions: [
    // TODO: this is a temporary entry
    {
      name: 'Mint tokens',
      description: 'All tokens come from this address',
      accounts: [
        {
          address: '0x0000000000000000000000000000000000000000',
          type: 'EOA',
        },
      ],
    },
  ],
}
