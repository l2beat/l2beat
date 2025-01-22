import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import type { Layer3 } from './types'

const discovery = new ProjectDiscovery('popboss', 'arbitrum')

export const popboss: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1710836229), // 2024-03-19T08:17:09Z
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Conduit,
  ],
  additionalPurposes: ['Gaming'],
  discovery,
  hostChain: ProjectId('arbitrum'),
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
    name: 'Proof of Play Boss',
    shortName: 'PoP Boss',
    slug: 'popboss',
    description:
      'Proof of Play Boss is a gaming-focused L3 settling on Arbitrum using the Orbit Stack and AnyTrust DA. It is the second L3 built by Proof of Play.',
    links: {
      websites: ['https://proofofplay.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=pop-boss&sourceChain=arbitrum-one',
        'https://piratenation.game/',
      ],
      documentation: [],
      explorers: ['https://explorer.boss.proofofplay.com'],
      repositories: ['https://github.com/proofofplay'],
      socialMedia: [
        'https://x.com/ProofOfPlay/',
        'https://discord.com/invite/piratenation',
        'https://piratenation.medium.com/',
      ],
    },
  },
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc.boss.proofofplay.com',
    defaultCallsPerMinute: 3000,
    assessCount: subtractOne,
  },
  discoveryDrivenData: true,
})
