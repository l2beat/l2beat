import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('settlus')
const genesisTimestamp = UnixTime(1736459256)

export const settlus: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  capability: 'universal',
  addedAt: UnixTime(1737636288), // 2025-01-23T12:44:48+00:00
  additionalBadges: [BADGES.RaaS.Alchemy],
  daTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 21890837, // first batch posted to the inbox; blobs again since block 25875293 (2026-08-31), Celestia in between
      inbox: EthereumAddress('0x003E40D3125591bD722aB1bB880c78e4D74d0977'),
      sequencers: [
        EthereumAddress('0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57'),
      ],
    },
    {
      type: 'celestia',
      daLayer: ProjectId('celestia'),
      sinceBlock: 9779673,
      untilBlock: 13618693, // last Celestia commitment before the switch back to blobs
      namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFPs=',
    },
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  isPartOfSuperchain: false,
  display: {
    name: 'Settlus',
    slug: 'settlus',
    stacks: ['OP Stack'],
    description:
      'Settlus is an OP stack L2 designed to provide transparent settlement system for the creator economy.',
    links: {
      websites: ['https://settlus.org/'],
      bridges: ['https://settlus-mainnet.bridge.alchemy.com/'],
      explorers: ['https://mainnet.settlus.network/'],
      documentation: ['https://docs.settlus.org/'],
      repositories: ['https://github.com/settlus'],
      socialMedia: [
        'https://x.com/Settlusofficial',
        'https://medium.com/@settlus_official',
      ],
    },
  },
  chainConfig: {
    name: 'settlus',
    chainId: 5371,
    apis: [],
  },
  discovery,
  genesisTimestamp,
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'Settlus switches back to Ethereum blobs',
      url: 'https://etherscan.io/tx/0xc9fff1fdd3ce712e0885d383459a132ba0d409021249e4d5f4543ed7ff936911',
      date: '2026-08-31T00:00:00Z',
      description:
        'Settlus stops posting data to Celestia and uses Ethereum blobs for data availability.',
      type: 'general',
    },
  ],
})
