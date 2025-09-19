import { ProjectId, UnixTime } from '@l2beat/shared-pure'
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
  discovery,
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
      explorers: ['https://explorer.arena-z.gg/'],
      socialMedia: ['https://x.com/OfficialArenaZ'],
    },
  },
  hasSuperchainScUpgrades: true,
  chainConfig: {
    name: 'arenaz',
    chainId: 7897,
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
