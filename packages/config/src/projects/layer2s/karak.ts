import { UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('karak')

export const karak: Layer2 = opStackL2({
  addedAt: new UnixTime(1687459278), // 2023-06-22T18:41:18Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [Badge.DA.Celestia, Badge.RaaS.Caldera],
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
      apps: ['https://karak.network/karak-xp/'],
      documentation: ['https://docs.karak.network/'],
      explorers: ['https://explorer.karak.network/'],
      socialMedia: [
        'https://twitter.com/Karak_Network',
        'https://t.me/Karak_Network',
      ],
    },
  },
  rpcUrl: 'https://rpc.karak.network/',
  genesisTimestamp: new UnixTime(1703226695), //First sequencer transaction
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
  knowledgeNuggets: [
    {
      title: 'Blobstream and Celestia Architecture',
      url: 'https://www.youtube.com/watch?v=cn_fN6pkakQ',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
})
