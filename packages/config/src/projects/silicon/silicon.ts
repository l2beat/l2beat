import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
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
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'Silicon',
    slug: 'silicon',
    description:
      'Silicon is a Validium built on the Polygon CDK Stack, aiming to become the social network of the future.',
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
      title: 'Silicon Mainnet Launch',
      url: 'https://x.com/0xSilicon/status/1828704079687917908',
      date: '2024-08-28',
      description: 'Silicon is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
})
