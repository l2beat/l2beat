import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('metal')

export const metal: Layer2 = opStackL2({
  discovery,
  associatedTokens: ['MTL'],
  badges: [Badge.Infra.Superchain, Badge.RaaS.Conduit],
  display: {
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is a general-purpose OP stack rollup by Metallicus focused on banking and compliance.',
    purposes: ['Universal'],
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
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.metall2.com',
  genesisTimestamp: new UnixTime(1711567115),
  // finality: {
  //   type: 'OPStack-blob',
  //   genesisTimestamp: new UnixTime(1711567115),
  //   minTimestamp: new UnixTime(1711565399), //first blob: https://etherscan.io/tx/0x24a3a82c9030b664159be27407ba980c663ccb9bc12b1e448b97b1741d8cefc0
  //   l2BlockTimeSeconds: 2,
  //   lag: 0,
  //   stateUpdate: 'disabled',
  // },

  // Set explicitly since finality calculation returns weird results
  finality: undefined,
  isNodeAvailable: 'UnderReview',
  usesBlobs: true,
  discoveryDrivenData: true,
})
