import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('dbk')

export const dbk: Layer2 = opStackL2({
  discovery,
  badges: [],
  display: {
    name: 'DeBank Chain',
    slug: 'dbk',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'DeBank Chain is an OP stack Layer 2 on Ethereum that is deeply integrated into the DeBank ecosystem, allowing bridging directly from inside the Rabby Wallet.',
    purposes: ['Universal'],
    links: {
      websites: ['https://dbkchain.io/'],
      apps: [],
      documentation: ['https://docs.dbkchain.io/'],
      explorers: ['https://scan.dbkchain.io/'],
      repositories: [],
      socialMedia: [
        'https://x.com/dbkchain',
        'https://debank.com/official/117425',
      ],
    },
    activityDataSource: 'Blockchain RPC',
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
      name: 'DeBank Chain Launch',
      link: 'https://debank.com/stream/2539393',
      date: '2024-07-19T00:00:00Z',
      description: 'DeBank mainnet is open for users.',
      type: 'general',
    },
  ],
  usesBlobs: true, // check inbox here https://etherscan.io/address/0xFf00000000000000000000000000000020240603
  useDiscoveryMetaOnly: true,
})
