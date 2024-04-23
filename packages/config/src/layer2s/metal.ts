import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('metal')

export const metal: Layer2 = opStackL2({
  discovery,
  genesisTimestamp: new UnixTime(1630000000),
  display: {
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is an upcoming scaling solution by Metallicus. It is powered by the OP Stack.',
    purposes: ['Universal'],
    links: {
      websites: ['https://metall2.com/'],
      apps: [],
      documentation: [],
      explorers: ['https://testnet-explorer.metall2.com/'],
      repositories: [],
      socialMedia: ['https://twitter.com/metalpaysme'],
    },
  },
})
