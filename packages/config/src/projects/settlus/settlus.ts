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
      sinceBlock: 21890837, // first batch posted to the inbox
      untilBlock: 24433367, // last blob batch before the switch to Celestia
      inbox: EthereumAddress('0x003E40D3125591bD722aB1bB880c78e4D74d0977'),
      sequencers: [
        EthereumAddress('0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57'),
      ],
    },
    {
      type: 'celestia',
      daLayer: ProjectId('celestia'),
      sinceBlock: 9779673,
      namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFPs=',
    },
  ],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
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
})
