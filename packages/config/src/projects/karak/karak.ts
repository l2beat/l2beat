import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { CELESTIA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('karak')

export const karak: ScalingProject = opStackL2({
  addedAt: UnixTime(1687459278), // 2023-06-22T18:41:18Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [BADGES.RaaS.Caldera],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'K2',
    slug: 'k2',
    description: 'K2 is a general-purpose Optimium.',
    links: {
      websites: ['https://karak.network/'],
      bridges: ['https://k2bridge.karak.network/'],
      explorers: ['https://explorer.karak.network/'],
      socialMedia: [
        'https://twitter.com/Karak_Network',
        'https://t.me/Karak_Network',
      ],
    },
  },
  chainConfig: {
    name: 'karak',
    chainId: 2410,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.karak.network/',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp: UnixTime(1703226695), //First sequencer transaction
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBA=',
  },
  isNodeAvailable: true,
  milestones: [
    {
      title: 'K2 Network Early Access Launch',
      url: 'https://x.com/Karak_Network/status/1762561646999068899?s=20',
      date: '2024-02-27T00:00:00Z',
      description: 'K2 Network is live on mainnet.',
      type: 'general',
    },
  ],
})
