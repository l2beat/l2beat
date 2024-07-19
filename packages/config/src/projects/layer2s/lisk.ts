import { UnixTime } from '@l2beat/shared-pure'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('lisk')

export const lisk: Layer2 = opStackL2({
  discovery,
  genesisTimestamp: new UnixTime(1714728793),
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'Lisk',
    slug: 'lisk',
    description:
      'Lisk announced a strategic move to integrate with the Ethereum ecosystem as an OP Stack L2.',
    purposes: ['Universal'],
    links: {
      websites: ['https://lisk.com/'],
      apps: [],
      documentation: ['https://lisk.com/documentation/'],
      explorers: ['https://liskscan.com/'],
      repositories: ['https://github.com/LiskHQ'],
      socialMedia: [
        'https://twitter.com/LiskHQ',
        'https://lisk.chat/',
        'https://t.me/Lisk_HQ',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  isNodeAvailable: true,
  rpcUrl: 'https://rpc.api.lisk.com',
  useDiscoveryMetaOnly: true,
})
