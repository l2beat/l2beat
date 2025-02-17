import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('playblock', 'nova')

export const playblock: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  discovery,
  additionalBadges: [Badge.DA.DAC, Badge.L3ParentChain.Nova, Badge.RaaS.Gelato],
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
  // not on coingecko
  // gasTokens: ['PBG'],
  // associatedTokens: ['PBG'],
  rpcUrl: 'https://playnance.drpc.org/',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery }),
})
