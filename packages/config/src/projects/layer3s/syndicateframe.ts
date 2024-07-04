import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL3 } from '../layer2s/templates/opStack'
import { Layer3 } from './types'
import { Badge } from '../badges'

const discovery = new ProjectDiscovery('syndicateframe', 'base')

export const syndicateframe: Layer3 = opStackL3({
  discovery,
  badges: [Badge.VM.EVM, Badge.Stack.OPStack, Badge.L3ParentChain.Base],
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
  nonTemplatePermissions: [
    {
      name: 'ProxyAdmin owner',
      description:
        'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('ProxyAdmin', 'owner'),
        ),
      ],
    },
  ],
  usesBlobs: true,
})
