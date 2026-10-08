import { UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('silicon')
const bridge = discovery.getContract('AgglayerBridge')

export const silicon: ScalingProject = agglayer({
  addedAt: UnixTime(1725027256), // 2024-08-30T14:14:16Z
  additionalBadges: [BADGES.RaaS.Nodeinfra],
  discovery,
  display: {
    name: 'Silicon',
    slug: 'silicon',
    description:
      'Silicon is a sovereign Agglayer chain built on the Polygon CDK, aiming to become the social network of the future.',
    links: {
      websites: ['https://silicon.network/'],
      bridges: ['https://bridge.silicon.network/'],
      documentation: ['https://docs.silicon.network/'],
      explorers: ['https://scope.silicon.network'],
      repositories: ['https://github.com/0xSilicon'],
      socialMedia: [
        'https://x.com/0xSilicon',
        'https://medium.com/@0xSilicon',
        'https://t.me/teamsilicon',
      ],
    },
  },
  chainConfig: {
    name: 'silicon',
    chainId: 2355,
    explorerUrl: 'https://scope.silicon.network',
    sinceTimestamp: UnixTime(1724183531),
    apis: [
      { type: 'rpc', url: 'https://rpc.silicon.network', callsPerMinute: 300 },
    ],
  },
  nonTemplateEscrows: [
    // shared
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherPreminted',
        premintedAmount: '340282366920938463463374607431768211455',
      },
    }),
  ],
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0xa5a1c5e3c627e972e6c3656017e900007567f9e8b7ecbd9cebd15d317c3c173d#eventlog',
      date: '2026-09-23',
      description:
        'Silicon stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'Silicon Mainnet Launch',
      url: 'https://x.com/0xSilicon/status/1828704079687917908',
      date: '2024-08-28',
      description: 'Silicon is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
})
