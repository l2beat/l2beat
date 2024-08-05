import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zircuit')

export const zircuit: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit is a universal ZK Rollup based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    purposes: ['Universal'],
    links: {
      websites: ['https://zircuit.com/'],
      apps: ['https://bridge.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: [],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  genesisTimestamp: new UnixTime(1719936217),
  rpcUrl: 'https://zircuit1-mainnet.p2pify.com/', // other: https://zircuit1-mainnet.liquify.com, https://zircuit-mainnet.drpc.org/
  // Chain ID: 48900
  usesBlobs: true,
  isNodeAvailable: 'UnderReview',
  useDiscoveryMetaOnly: true,
  milestones: [
    {
      name: 'Zircuit Mainnet Launch',
      link: 'https://www.zircuit.com/blog/zircuit-raises-mainnet-funding-round', // WRONG LINK
      date: '2024-08-05T00:00:00.00Z',
      description: 'Zircuit is live on mainnet.',
    },
  ],
})
