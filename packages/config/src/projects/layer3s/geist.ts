import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import type { Layer3 } from './types'

const discovery = new ProjectDiscovery('geist', 'base')

export const geist: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  hostChain: ProjectId('base'),
  additionalPurposes: ['Gaming', 'NFT'],
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Base,
    Badge.RaaS.Alchemy,
  ],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
    name: 'Geist',
    slug: 'geist',
    description:
      'Geist is an Orbit stack Optimium on Base. It is focused on creating a better gaming and metaverse experience around AavegotchiDAO and the GHST governance token.',
    category: 'Optimium',
    links: {
      websites: ['https://playongeist.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=geist-mainnet&sourceChain=base',
        'https://dapp.aavegotchi.com/migrate?type=migrateTokens&fromChain=137&toChain=63157',
      ],
      documentation: ['https://docs.playongeist.com/'],
      explorers: ['https://geist-mainnet.explorer.alchemy.com/'],
      repositories: [],
      socialMedia: [
        'https://x.com/aavegotchi',
        'https://dapp.aavegotchi.com/?utm_source=geist',
      ],
    },
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://geist-mainnet.g.alchemy.com/public',
    defaultCallsPerMinute: 600,
    assessCount: subtractOne,
    startBlock: 1,
  },
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  associatedTokens: ['GHST'],
  gasTokens: ['GHST'],
  discovery,
  discoveryDrivenData: true,
  dataAvailabilitySolution: AnytrustDAC({
    bridge: {
      createdAt: new UnixTime(1737711018), // 2025-01-24T09:30:18+00:00
    },
    discovery,
  }),
})
