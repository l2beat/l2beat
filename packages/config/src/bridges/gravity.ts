import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const gravity: Bridge = {
  type: 'bridge',
  id: ProjectId('gravity'),
  display: {
    name: 'Gravity',
    slug: 'gravity',
    links: {
      websites: ['https://www.gravitybridge.net/'],
      explorers: [
        'https://www.mintscan.io/gravity-bridge',
        'https://www.skynetexplorers.com/gravity-bridge',
      ],
      apps: [
        'https://spacestation.zone/',
        'https://bridge.blockscape.network/',
      ],
      repositories: ['https://github.com/Gravity-Bridge'],
      documentation: ['https://github.com/Gravity-Bridge/Gravity-Docs'],
      socialMedia: [
        'https://twitter.com/gravity_bridge',
        'https://discord.gg/d3DshmHpXA',
      ],
    }, //todo
    description:
      'Gravity bridge is a token transfer bridge designed to connect cosmos and ethereum ecosystems together. The bridge is validated ... todo',
  },
  config: {
    escrows: [
      {
        address: '0xa4108aA1Ec4967F8b52220a4f7e94A8201F2D906',
        sinceTimestamp: new UnixTime(1639416372),
        tokens: ['USDC', 'WETH', 'DAI'],
      },
    ],
  },
  riskView: {
    validation: {
      value: '',
      description: '',
      sentiment: '',
    },
    sourceUpgradeability: {
      value: '',
      description: '',
      sentiment: '',
    },
    destinationToken: {
      value: '',
      description: '',
      sentiment: '',
    },
  },
  technology: {
    destination: ['Cosmos'],
    canonical: false,
    category: 'Lock-Mint',
    principleOfOperation: {
      name: '',
      description: '',
      references: [],
      risks: [],
    },
  },
}
