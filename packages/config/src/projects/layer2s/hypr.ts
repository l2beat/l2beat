import { UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('hypr')

export const hypr: Layer2 = opStackL2({
  isArchived: true,
  addedAt: new UnixTime(1695904849), // 2023-09-28T12:40:49Z
  daProvider: CELESTIA_DA_PROVIDER,
  additionalBadges: [Badge.DA.Celestia],
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
      apps: ['https://bridge.hypr.network/'],
      documentation: ['https://docs.hypr.network'],
      explorers: ['https://explorer.hypr.network/'],
      socialMedia: [
        'https://twitter.com/hypr_network',
        'https://t.me/hyprnetwork',
      ],
    },
  },
  genesisTimestamp: new UnixTime(1705509623),
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
  discoveryDrivenData: true,
  // rpcUrl: 'https://rpc.hypr.network',
  // associatedTokens: ['HYPR'], removed due to insufficient price data
})
