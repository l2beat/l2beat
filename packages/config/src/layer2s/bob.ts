import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const bob: Layer2 = upcoming({
  id: 'bob',
  display: {
    name: 'BOB',
    slug: 'bob',
    description:
      'BOB ("Build on Bitcoin") is an OP Stack rollup that natively supports the Bitcoin stack, incl. Ordinals, Lightning and Nostr, powered by cross-chain light clients, a universal Bitcoin smart contract SDK, and the Risc Zero zkVM.',
    purpose: ['Bitcoin DApps'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://gobob.xyz'],
      apps: [],
      documentation: ['https://docs.gobob.xyz'],
      explorers: ['https://testnet-explorer.gobob.xyz/'],
      repositories: ['https://github.com/bob-collective'],
      socialMedia: ['https://twitter.com/build_on_bob'],
    },
  },
})
