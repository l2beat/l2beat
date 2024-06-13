import { assert, UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('xterio')

export const xterio: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Xterio Chain',
    slug: 'xterio',
    description:
      'Xterio Chain, a true leader in Gaming Rollup, is dedicated to fulfilling the needs of billions of Web3 game players worldwide. With a steadfast promise to provide the utmost efficiency, security, and customization options, Xterio Chain enables seamless on-chain transactions within its ecosystem.',
    purposes: ['Universal', 'Gaming'],
    links: {
      websites: ['https://xter.io/'],
      apps: ['https://xter.io/', 'https://eth-bridge.xter.io/'],
      documentation: ['https://stack.optimism.io/'],
      explorers: ['https://eth.xterscan.io/'],
      repositories: ['https://github.com/XterioTech'],
      socialMedia: [
        'https://x.com/XterioGames',
        'https://discord.gg/xterio',
        'https://medium.com/@XterioGames',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  genesisTimestamp: new UnixTime(1716537431),
  isNodeAvailable: true,
  rpcUrl: 'https://xterio-eth.alt.technology/',
})
