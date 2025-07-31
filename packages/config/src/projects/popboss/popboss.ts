import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('popboss')

export const popboss: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1710836229), // 2024-03-19T08:17:09Z
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Conduit],
  additionalPurposes: ['Gaming'],
  hostChain: 'arbitrum',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Proof of Play Boss',
    shortName: 'PoP Boss',
    slug: 'popboss',
    description:
      'Proof of Play Boss is a gaming-focused L3 settling on Arbitrum using the Orbit Stack and AnyTrust DA. It is the second L3 built by Proof of Play.',
    links: {
      websites: ['https://proofofplay.com/'],
      bridges: [
        'https://bridge.arbitrum.io/?destinationChain=pop-boss&sourceChain=arbitrum-one',
        'https://piratenation.game/',
      ],
      explorers: ['https://explorer.boss.proofofplay.com'],
      repositories: ['https://github.com/proofofplay'],
      socialMedia: [
        'https://x.com/ProofOfPlay/',
        'https://discord.com/invite/piratenation',
        'https://piratenation.medium.com/',
      ],
    },
  },
  chainConfig: {
    name: 'popboss',
    chainId: 70701,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.boss.proofofplay.com',
        callsPerMinute: 3000,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
})
