import { UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('ancient')

const upgradeability = {
  upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
}

export const ancient: Layer2 = opStackL2({
  addedAt: new UnixTime(1695904849), // 2023-09-28T12:40:49Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [Badge.DA.Celestia, Badge.RaaS.Conduit],
  additionalPurposes: ['Gaming'],
  discovery,
  associatedTokens: ['A8'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Ancient8',
    slug: 'ancient8',
    description:
      'Ancient8 Chain is a gaming-focused community-driven Ethereum Layer 2 built using OP Stack.',
    links: {
      websites: ['https://ancient8.gg/'],
      apps: ['https://bridge.ancient8.gg/', 'https://space3.gg/A8Layer2'],
      documentation: ['https://docs.ancient8.gg/'],
      explorers: ['https://scan.ancient8.gg/'],
      socialMedia: [
        'https://twitter.com/Ancient8_gg',
        'https://discord.gg/ancient8',
        'https://blog.ancient8.gg/',
        'https://t.me/ancient8_gg',
        'https://youtube.com/@Ancient8_gg',
        'https://linkedin.com/company/ancient8',
      ],
    },
  },
  upgradeability,
  rpcUrl: 'https://rpc.ancient8.gg/',
  genesisTimestamp: new UnixTime(1705985147),
  isNodeAvailable: 'UnderReview',
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAADE4vVvVyRsg=',
  },
  milestones: [
    {
      title: 'Ancient8 Network Launch',
      url: 'https://twitter.com/Ancient8_gg/status/1760666331764961479',
      date: '2024-02-22T00:00:00Z',
      description: 'Ancient8 Chain is live on mainnet.',
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
