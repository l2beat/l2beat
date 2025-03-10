import { UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'
import { BADGES } from '../badges'

const discovery = new ProjectDiscovery('metal')

export const metal: ScalingProject = opStackL2({
  addedAt: UnixTime(1695904849), // 2023-09-28T12:40:49Z
  discovery,
  associatedTokens: ['MTL'],
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is a general-purpose OP stack rollup by Metallicus focused on banking and compliance.',
    links: {
      websites: ['https://metall2.com/'],
      apps: [
        'https://bridge.metall2.com/',
        'https://dollar.metalx.com/',
        'https://metalpay.com/',
      ],
      documentation: ['https://docs.metall2.com'],
      explorers: ['https://explorer.metall2.com'],
      repositories: ['https://github.com/MetalPay'],
      socialMedia: [
        'https://twitter.com/metalpaysme',
        'https://reddit.com/r/metalpay/',
        'https://facebook.com/metalpaysme',
        'https://t.me/metalpaysme',
        'https://linkedin.com/company/metallicus',
      ],
    },
  },
  chainConfig: {
    name: 'metal',
    chainId: 1750,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.metall2.com',
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: UnixTime(1711567115),
  // finality: {
  //   type: 'OPStack-blob',
  //   genesisTimestamp: UnixTime(1711567115),
  //   minTimestamp: UnixTime(1711565399), //first blob: https://etherscan.io/tx/0x24a3a82c9030b664159be27407ba980c663ccb9bc12b1e448b97b1741d8cefc0
  //   l2BlockTimeSeconds: 2,
  //   lag: 0,
  //   stateUpdate: 'disabled',
  // },

  // Set explicitly since finality calculation returns weird results
  finality: undefined,
  isNodeAvailable: 'UnderReview',
})
