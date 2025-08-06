import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('pepeunchained2')

export const pepeunchained2: ScalingProject = orbitStackL2({
  capability: 'universal',
  addedAt: UnixTime(1752134764), //10-7-2025
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  additionalBadges: [BADGES.RaaS.Conduit],

  display: {
    name: 'Pepe Unchained',
    slug: 'pepe-unchained',
    description:
      'Pepe Unchained is an Optimium utilizing the Orbit Stack. It focuses on memes and provides a home for meme creators, traders, and communities to thrive.',
    category: 'Other',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://pepeunchained.com/'],
      bridges: ['https://pepubridge.com/'],
      documentation: ['https://guide.pepeunchained.com/'],
      explorers: ['https://pepuscan.com'],
      socialMedia: ['https://x.com/pepe_unchained', 'https://t.me/pepeunchn'],
    },
  },
  associatedTokens: ['PEPU'],
  chainConfig: {
    name: 'pepeunchained2',
    gasTokens: ['PEPU'],
    chainId: 97741,
    sinceTimestamp: UnixTime(1748891003),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-pepu-v2-mainnet-0.t.conduit.xyz',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
  milestones: [
    {
      title: 'Mainnet migration',
      description:
        'Pepe Unchained migrates their optimium from op stack to orbit stack.',
      url: 'https://x.com/pepe_unchained/status/1928485153132916993',
      date: '2025-05-30T00:00:00Z',
      type: 'general',
    },
  ],
})
