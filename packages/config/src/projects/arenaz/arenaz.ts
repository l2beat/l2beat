import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('arenaz')
const genesisTimestamp = UnixTime(1731366083)

export const arenaz = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1737720994), // 2025-01-24T12:16:34+00:00
  archivedAt: UnixTime.fromDate(new Date('2026-05-07')),
  discovery,
  daTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 21169100, // first batch of the original batcher
      untilBlock: 24776391, // batcher rotation, last old-batcher batch @ 24774882
      inbox: EthereumAddress('0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0'),
      sequencers: [
        EthereumAddress('0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c'),
      ],
    },
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 24776391, // first batch of the rotated batcher
      untilBlock: 25228892, // last batch before archival
      inbox: EthereumAddress('0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0'),
      sequencers: [
        EthereumAddress('0x47827645bA78EB18c3d64Fe2146EfdE66F74894B'),
      ],
    },
  ],
  additionalBadges: [BADGES.RaaS.Gelato],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Arena-Z',
    slug: 'arenaz',
    description:
      'Arena-Z is an OP stack Optimistic Rollup where studios and gamers, creators and players unite to pioneer the future of entertainment.',
    links: {
      websites: ['https://arena-z.gg/'],
      bridges: ['https://bridge.arena-z.gg/', 'https://leagueofkingdoms.com/'],
      documentation: ['https://whitepaper.playersarena.foundation/arena-z'],
      explorers: ['https://explorer.arena-z.gg/'],
      socialMedia: [
        'https://x.com/OfficialArenaZ',
        'https://discord.com/invite/arenaz-a2z',
      ],
    },
  },
  hasSuperchainScUpgrades: true,
  chainConfig: {
    name: 'arenaz',
    chainId: 7897,
    untilTimestamp: UnixTime.fromDate(new Date('2026-05-07')),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.arena-z.gg/',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('ARENAZ'),
  isNodeAvailable: 'UnderReview',
})
