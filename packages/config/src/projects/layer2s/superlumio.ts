import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('superlumio')

export const superlumio: Layer2 = opStackL2({
  discovery,
  badges: [Badge.RaaS.Conduit],
  display: {
    name: 'SuperLumio',
    slug: 'superlumio',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'SuperLumio (сanary mainnet) marks the initial phase of the Lumio Layer 2 on the Optimism Superchain, launched as a pure Ethereum Virtual Machine fork with the support of Conduit technology. This platform is designed to serve as a testnet-in-production. Lumio is a rollup technology suite that enables developers to build with any VM on any chain.',
    purposes: ['Universal'],
    links: {
      websites: ['https://lumio.io/'],
      apps: [],
      documentation: ['https://docs.lumio.io/'],
      explorers: ['https://explorer.lumio.io/'],
      repositories: ['https://github.com/pontem-network'],
      socialMedia: [
        'https://x.com/lumiofdn',
        'https://t.me/pontemnetworkchat',
        'https://discord.com/invite/44QgPFHYqs',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://mainnet.lumio.io',
  genesisTimestamp: new UnixTime(1708984633),
  finality: {
    type: 'OPStack-blob',
    genesisTimestamp: new UnixTime(1708984633),
    minTimestamp: new UnixTime(1708984751),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      name: 'SuperLumio Launch',
      link: 'https://x.com/PontemNetwork/status/1762887219235127612',
      date: '2024-02-28T00:00:00Z',
      description: 'SuperLumio launch is announced on X.',
      type: 'general',
    },
  ],
  usesBlobs: true,
  discoveryDrivenData: true,
})
