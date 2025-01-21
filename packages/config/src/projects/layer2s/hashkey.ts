import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from './types'
import { opStackL2 } from './templates/opStack'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('hashkey')

export const hashkey: Layer2 = opStackL2({
  createdAt: new UnixTime(1736518370), // 2025-01-10T17:09:00Z
  additionalPurposes: ['Exchange'],
  display: {
    name: 'HashKey Chain',
    slug: 'hashkey',
    description: "HashKey Chain is a regulatory-compliant, institutional-grade OP stack Layer 2 solution bridging traditional finance and Web3. It is powered by Hong Kong's premier virtual asset ecosystem.",
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://hsk.xyz/'],
      apps: ['https://bridge.hsk.xyz/'],
      documentation: ['https://docs.hsk.xyz/'],
      explorers: ['https://explorer.hsk.xyz/', 'https://hashkey.blockscout.com'],
      repositories: ['https://github.com/HashKeyChain'],
      socialMedia: [
        'https://x.com/HashKeyHSK',
        'https://t.me/hashkeyhsk',
        'https://discord.com/invite/ujaF7aKAEk',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  isNodeAvailable: 'UnderReview',
  rpcUrl: 'https://mainnet.hsk.xyz',
  discovery,
  genesisTimestamp: new UnixTime(1734347135)
})
