import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL3 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('donatuz')

export const donatuz: ScalingProject = opStackL3({
  addedAt: UnixTime(1726497628), // 2024-09-16T14:40:28Z
  archivedAt: UnixTime(1751896254), // 2025-07-07T13:50:54Z
  hostChain: 'base',
  discovery,
  daProvider: EIGENDA_DA_PROVIDER,
  additionalBadges: [
    BADGES.L3ParentChain.Base,
    BADGES.DA.EigenDA,
    BADGES.RaaS.Conduit,
  ],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Donatuz',
    slug: 'donatuz',
    description:
      'Donatuz is a Layer-3 that aims at providing social media creators with innovative monetization tools to earn money from their content.',
    links: {
      websites: ['https://donatuz.org/'],
      bridges: ['https://bridge.donatuz.com'],
      explorers: ['https://explorer.donatuz.com/'],
      repositories: ['https://github.com/Donatuz-Labs'],
      socialMedia: [
        'https://x.com/Donatuz_',
        'https://t.me/donatuzz',
        'https://linkedin.com/company/donatuz/',
      ],
    },
  },
  genesisTimestamp: UnixTime(1719319433),
  chainConfig: {
    name: 'donatuz',
    chainId: 42026,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.donatuz.com',
        callsPerMinute: 1500,
      },
    ],
  },
  isNodeAvailable: true,
})
