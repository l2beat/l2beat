import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('superlumio')

export const superlumio: ScalingProject = opStackL2({
  addedAt: UnixTime(1726646157), // 2024-09-18T07:55:57Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'SuperLumio',
    slug: 'superlumio',
    description:
      'SuperLumio (сanary mainnet) marks the initial phase of the Lumio Layer 2 on the Optimism Superchain, launched as a pure Ethereum Virtual Machine fork with the support of Conduit technology. This platform is designed to serve as a testnet-in-production. Lumio is a rollup technology suite that enables developers to build with any VM on any chain.',
    links: {
      websites: ['https://lumio.io/'],
      documentation: ['https://docs.lumio.io/'],
      explorers: ['https://explorer.lumio.io/'],
      repositories: ['https://github.com/pontem-network'],
      socialMedia: [
        'https://x.com/lumiofdn',
        'https://t.me/pontemnetworkchat',
        'https://discord.com/invite/44QgPFHYqs',
      ],
    },
  },
  chainConfig: {
    name: 'superlumio',
    chainId: 8866,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.lumio.io',
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: UnixTime(1708984633),
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'SuperLumio Launch',
      url: 'https://x.com/PontemNetwork/status/1762887219235127612',
      date: '2024-02-28T00:00:00Z',
      description: 'SuperLumio launch is announced on X.',
      type: 'general',
    },
  ],
})
