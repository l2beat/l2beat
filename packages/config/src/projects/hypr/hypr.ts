import { UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { CELESTIA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('hypr')

export const hypr: ScalingProject = opStackL2({
  addedAt: UnixTime(1695904849), // 2023-09-28T12:40:49Z
  archivedAt: UnixTime(1737072000), // 2025-01-17T00:00:00.000Z,
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [BADGES.DA.Celestia],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Hypr',
    slug: 'hypr',
    description: 'Hypr is a blockchain focused on scaling ZK gaming.',
    links: {
      websites: ['https://hypr.network/'],
      bridges: ['https://bridge.hypr.network/'],
      documentation: ['https://docs.hypr.network'],
      explorers: ['https://explorer.hypr.network/'],
      socialMedia: [
        'https://twitter.com/hypr_network',
        'https://t.me/hyprnetwork',
      ],
    },
  },
  genesisTimestamp: UnixTime(1705509623),
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAABqVjuNvNnoE=',
  },
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'Hypr live on mainnet',
      url: 'https://x.com/hypr_network/status/1750251802451378528',
      date: '2024-01-24T00:00:00Z',
      description: 'Hypr launches on mainnet.',
      type: 'general',
    },
  ],
  // rpcUrl: 'https://rpc.hypr.network',
  // associatedTokens: ['HYPR'], removed due to insufficient price data
})
