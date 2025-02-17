import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('geist', 'base')

export const geist: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  additionalPurposes: ['Gaming', 'NFT'],
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Base,
    Badge.RaaS.Alchemy,
  ],
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
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://geist-mainnet.g.alchemy.com/public',
    defaultCallsPerMinute: 600,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  associatedTokens: ['GHST'],
  gasTokens: ['GHST'],
  discovery,
  customDa: AnytrustDAC({ discovery }),
})
