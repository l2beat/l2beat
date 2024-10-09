import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL3 } from '../layer2s/templates/opStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('syndicateframe', 'base')

export const syndicateframe: Layer3 = opStackL3({
  discovery,
  badges: [Badge.L3ParentChain.Base, Badge.RaaS.Caldera],
  hostChain: ProjectId('base'),
  display: {
    name: 'Syndicate Frame Chain',
    shortName: 'Frame Chain',
    slug: 'syndicateframe',
    description:
      'Syndicate Frame Chain is an OP Stack L3 on Base for Farcaster Frame developers.',
    purposes: ['Social', 'NFT'],
    links: {
      websites: ['https://syndicate.io/blog/syndicate-frame-chain'],
      apps: [
        'https://bridge-frame.syndicate.io/',
        'https://frame.syndicate.io/',
      ],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
      explorers: ['https://explorer-frame.syndicate.io/'],
      repositories: [
        'https://github.com/WillPapper/syndicate-farcaster-frame-starter',
      ],
      socialMedia: [
        'https://warpcast.com/syndicate',
        'https://x.com/syndicateio',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc-frame.syndicate.io',
  genesisTimestamp: new UnixTime(1707371473),
  isNodeAvailable: 'UnderReview',
  usesBlobs: true,
  discoveryDrivenData: true,
})
