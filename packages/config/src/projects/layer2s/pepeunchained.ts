import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('pepeunchained')

export const pepeunchained: Layer2 = opStackL2({
  addedAt: new UnixTime(1739541812), // 2025-02-14T14:03:32Z
  daProvider: CELESTIA_DA_PROVIDER,
  celestiaDa: {
    sinceBlock: 21314461,
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAADzZzvipmzP4=',
  },
  additionalBadges: [Badge.RaaS.Conduit],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Pepe Unchained',
    slug: 'pepeunchained',
    description:
      'Pepe Unchained is an Optimium utilizing the OP Stack. It focuses on memes and provides a home for meme creators, traders, and communities to thrive.',
    links: {
      websites: ['https://pepeunchained.com/'],
      apps: ['https://pepubridge.com/'],
      documentation: ['https://guide.pepeunchained.com/'],
      explorers: ['https://pepuscan.com'],
      socialMedia: ['https://x.com/pepe_unchained'],
    },
  },
  rpcUrl: 'https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz',
  genesisTimestamp: new UnixTime(1733132700),
  isNodeAvailable: true,
})
