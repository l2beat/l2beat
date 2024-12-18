import { UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('karak')

export const karak: Layer2 = opStackL2({
  createdAt: new UnixTime(1687459278), // 2023-06-22T18:41:18Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [Badge.DA.Celestia, Badge.RaaS.Caldera],
  discovery,
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    name: 'K2',
    slug: 'k2',
    description: 'K2 is a general-purpose Optimium.',
    links: {
      websites: ['https://karak.network/'],
      apps: ['https://karak.network/karak-xp/'],
      documentation: ['https://docs.karak.network/'],
      explorers: ['https://explorer.karak.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Karak_Network',
        'https://t.me/Karak_Network',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.karak.network/',
  genesisTimestamp: new UnixTime(1703226695), //First sequencer transaction
  isNodeAvailable: true,
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'K2 Network Early Access Launch',
      link: 'https://x.com/Karak_Network/status/1762561646999068899?s=20',
      date: '2024-02-27T00:00:00Z',
      description: 'K2 Network is live on mainnet.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Blobstream and Celestia Architecture',
      url: 'https://www.youtube.com/watch?v=cn_fN6pkakQ',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
})
