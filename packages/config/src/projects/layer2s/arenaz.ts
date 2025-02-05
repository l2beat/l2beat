import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('arenaz')
const genesisTimestamp = new UnixTime(1731366083)

export const arenaz = opStackL2({
  addedAt: new UnixTime(1737720994), // 2025-01-24T12:16:34+00:00
  discovery,
  additionalBadges: [Badge.RaaS.Gelato],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Arena-Z',
    slug: 'arenaz',
    description:
      'Arena-Z is an OP stack Optimistic Rollup where studios and gamers, creators and players unite to pioneer the future of entertainment.',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://arena-z.gg/'],
      apps: [
        'https://bridge.arena-z.gg/bridge/arena-z',
        'https://leagueofkingdoms.com/',
      ],
      explorers: ['https://explorer.arena-z.gg/'],
      socialMedia: ['https://x.com/OfficialArenaZ'],
    },
  },
  rpcUrl: 'https://rpc.arena-z.gg/',
  finality: {
    type: 'OPStack',
    minTimestamp: genesisTimestamp,
    genesisTimestamp: genesisTimestamp,
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('ARENAZ'),
  isNodeAvailable: 'UnderReview',
})
