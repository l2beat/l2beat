import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { BADGES } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('geist', 'base')

export const geist: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1720191862), // 2024-07-05T15:04:22Z
  additionalPurposes: ['Gaming', 'NFT'],
  additionalBadges: [BADGES.L3ParentChain.Base, BADGES.RaaS.Alchemy],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'Geist',
    slug: 'geist',
    description:
      'Geist is an Orbit stack Optimium on Base. It is focused on creating a better gaming and metaverse experience around the AavegotchiDAO and the GHST governance token.',
    category: 'Optimium',
    links: {
      websites: ['https://playongeist.com/', 'https://dapp.aavegotchi.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=geist-mainnet&sourceChain=base',
        'https://dapp.aavegotchi.com/migrate?type=migrateTokens&fromChain=137&toChain=63157',
      ],
      documentation: ['https://docs.playongeist.com/'],
      explorers: ['https://geist-mainnet.explorer.alchemy.com/'],
      socialMedia: [
        'https://x.com/PlayOnGeist',
        'https://x.com/aavegotchi',
        'https://discord.gg/Aavegotchi',
      ],
    },
  },
  chainConfig: {
    name: 'geist',
    chainId: 63157,
    apis: [
      {
        type: 'rpc',
        url: 'https://geist-mainnet.g.alchemy.com/public',
        callsPerMinute: 600,
      },
    ],
    gasTokens: ['GHST'],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  associatedTokens: ['GHST'],
  discovery,
  customDa: AnytrustDAC({ discovery }),
})
