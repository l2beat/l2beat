import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { CELESTIA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('ancient')

const upgradeability = {
  upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
}

export const ancient: ScalingProject = opStackL2({
  addedAt: UnixTime(1695904849), // 2023-09-28T12:40:49Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['Gaming'],
  discovery,
  associatedTokens: ['A8'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Ancient8',
    slug: 'ancient8',
    description:
      'Ancient8 Chain is a gaming-focused community-driven Ethereum Layer 2 built using OP Stack.',
    links: {
      websites: ['https://ancient8.gg/'],
      bridges: ['https://app.ancient8.gg/bridge', 'https://space3.gg/A8Layer2'],
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
  chainConfig: {
    name: 'ancient',
    chainId: 888888888,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.ancient8.gg/',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp: UnixTime(1705985147),
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
})
