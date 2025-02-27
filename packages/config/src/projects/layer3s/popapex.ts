import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { BADGES } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('popapex', 'arbitrum')

export const popapex: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1710836229), // 2024-03-19T08:17:09Z
  additionalBadges: [
    BADGES.DA.DAC,
    BADGES.L3ParentChain.Arbitrum,
    BADGES.RaaS.Conduit,
  ],
  additionalPurposes: ['Gaming'],
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Proof of Play Apex',
    shortName: 'PoP Apex',
    slug: 'popapex',
    description:
      'Proof of Play Apex is a gaming-focused L3 settling on Arbitrum using the Orbit Stack and AnyTrust DA.',
    links: {
      websites: ['https://proofofplay.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=pop-apex&sourceChain=arbitrum-one',
        'https://piratenation.game/',
      ],
      explorers: ['https://explorer.apex.proofofplay.com'],
      repositories: ['https://github.com/proofofplay'],
      socialMedia: [
        'https://twitter.com/ProofOfPlay',
        'https://discord.com/invite/piratenation',
        'https://piratenation.medium.com/',
      ],
    },
  },
  chainConfig: {
    name: 'popapex',
    chainId: 70700,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.apex.proofofplay.com',
        callsPerMinute: 5000,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  milestones: [
    {
      title: 'Proof of Play Apex halts for two days',
      date: '2024-05-13T00:00:00Z',
      url: 'https://x.com/conduitxyz/status/1790065376975552549',
      description:
        'Proof of Play halts for two days due to a chain misconfiguration.',
      type: 'incident',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
