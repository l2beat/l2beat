import { UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('plumenetwork', 'ethereum')

export const plumenetwork: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1719224239), // 2024-06-24T10:17:19Z
  additionalBadges: [BADGES.RaaS.Conduit],
  discovery,
  display: {
    name: 'Plume Network',
    slug: 'plumenetwork',
    description:
      'Plume is a modular L2 blockchain for real-world assets (RWAs) that integrates asset tokenization and compliance providers directly into the chain.',
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://plume.org/'],
      bridges: ['https://portal.plume.org'],
      documentation: ['https://docs.plume.org/plume'],
      explorers: ['https://explorer.plume.org'],
      repositories: ['https://github.com/plumenetwork'],
      socialMedia: [
        'https://twitter.com/plumenetwork',
        'https://discord.gg/plume',
        'https://t.me/plumenetwork_community',
      ],
    },
  },
  additionalPurposes: ['RWA'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'plumenetwork',
    chainId: 98866,
    explorerUrl: 'https://explorer.plume.org',
    sinceTimestamp: UnixTime(1740047951),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.plume.org',
        callsPerMinute: 1500,
      },
    ],
  },
})
