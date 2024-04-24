import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('metal')

export const metal: Layer2 = opStackL2({
  discovery,
  genesisTimestamp: new UnixTime(1711567115),
  display: {
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is an OP stack rollup by Metallicus focused on banking and compliance.',
    purposes: ['Universal'],
    links: {
      websites: ['https://metall2.com/'],
      apps: ['https://bridge.metall2.com/','https://dollar.metalx.com/', 'https://metalpay.com/'],
      documentation: [],
      explorers: ['https://explorer.metall2.com'],
      repositories: [],
      socialMedia: ['https://twitter.com/metalpaysme'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // add superchain
  rpcUrl: 'https://rpc.metall2.com',
  isNodeAvailable: 'UnderReview',
  usesBlobs: true,
})
