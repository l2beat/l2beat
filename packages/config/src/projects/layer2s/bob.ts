import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('bob')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const bob: Layer2 = opStackL2({
  discovery,
  upgradeability,
  display: {
    name: 'BOB',
    slug: 'bob',
    description:
      'BOB ("Build on Bitcoin") is an OP Stack rollup that natively supports the Bitcoin stack, incl. Ordinals, Lightning and Nostr, powered by cross-chain light clients, a universal Bitcoin smart contract SDK, and the Risc Zero zkVM.',
    purposes: ['Bitcoin DApps'],
    links: {
      websites: ['https://gobob.xyz'],
      apps: ['https://app.gobob.xyz'],
      documentation: ['https://docs.gobob.xyz'],
      explorers: ['https://explorer.gobob.xyz?'],
      repositories: ['https://github.com/bob-collective'],
      socialMedia: ['https://twitter.com/build_on_bob'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  usesBlobs: true,
  genesisTimestamp: new UnixTime(1712861987),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Phase 1: Optimistic BOB',
      link: 'https://docs.gobob.xyz/docs/learn/bob-stack/op-stack',
      date: '2024-05-01T09:00:00Z',
      description: 'BOB bootstrapping as an Optimistic Rollup on Ethereum.',
    },
  ],
  rpcUrl: 'https://rpc.gobob.xyz/',
  chainConfig: {
    name: 'bob',
    chainId: 60808,
    explorerUrl: 'https://explorer.gobob.xyz',
    explorerApi: {
      url: 'https://explorer.gobob.xyz/api',
      type: 'blockscout',
    },
    // ~ Timestamp of block number 0 on BOB
    // https://explorer.gobob.xyz/block/0
    minTimestampForTvl: new UnixTime(1712861987),
  },
})
