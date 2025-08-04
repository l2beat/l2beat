import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('playblock')

export const playblock: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: 'nova',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Nova, BADGES.RaaS.Gelato],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'PlayBlock',
    slug: 'playblock',
    description:
      'PlayBlock is an Orbit stack Layer 3 on Arbitrum Nova. It is built by the team behind Playnance, and is focused on gasless gaming and gambling.',
    links: {
      websites: ['https://playnance.com/'],
      explorers: ['https://explorer.playblock.io/'],
      repositories: ['https://github.com/playnance-games/PlayBlock'],
      socialMedia: ['https://twitter.com/Playnancetech'],
    },
  },
  // associatedTokens: ['PBG'],
  untrackedGasTokens: ['PBG'],
  chainConfig: {
    name: 'playblock',
    chainId: 1829,
    apis: [
      { type: 'rpc', url: 'https://playnance.drpc.org/', callsPerMinute: 1500 },
    ],
    gasTokens: ['PBG'],
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'nova' }),
})
