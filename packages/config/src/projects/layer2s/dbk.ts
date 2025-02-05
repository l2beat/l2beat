import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('dbk')

export const dbk: Layer2 = opStackL2({
  addedAt: new UnixTime(1726825120), // 2024-09-20T09:38:40Z
  discovery,
  additionalBadges: [],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'DeBank Chain',
    slug: 'dbk',
    description:
      'DeBank Chain is an OP stack Layer 2 on Ethereum that is deeply integrated into the DeBank ecosystem, allowing bridging directly from inside the Rabby Wallet.',
    links: {
      websites: ['https://dbkchain.io/'],
      documentation: ['https://docs.dbkchain.io/'],
      explorers: ['https://scan.dbkchain.io/'],
      socialMedia: [
        'https://x.com/dbkchain',
        'https://debank.com/official/117425',
      ],
    },
  },
  rpcUrl: 'https://rpc.mainnet.dbkchain.io/',
  genesisTimestamp: new UnixTime(1717461337),
  // incompatible
  // finality: {
  //   type: 'OPStack-blob',
  //   genesisTimestamp: new UnixTime(1717461337),
  //   minTimestamp: new UnixTime(1717485635), // first blob https://etherscan.io/tx/0x5206806df7d2124910f2c44f38bb34b6ab99b9dfbea94c6ae6a793f1600e3363
  //   l2BlockTimeSeconds: 2,
  //   lag: 0,
  //   stateUpdate: 'disabled',
  // },
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'DeBank Chain Launch',
      url: 'https://debank.com/stream/2539393',
      date: '2024-07-19T00:00:00Z',
      description: 'DeBank mainnet is open for users.',
      type: 'general',
    },
  ],
})
