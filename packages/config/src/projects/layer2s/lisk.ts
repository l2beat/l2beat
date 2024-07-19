import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('lisk')

export const lisk: Layer2 = opStackL2({
  discovery,
  genesisTimestamp: new UnixTime(1714728793),
  associatedTokens: ['LSK'],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'Lisk',
    slug: 'lisk',
    description:
      'Lisk is an OP stack rollup on Ethereum that migrated from the L1 blockchain of the same name.',
    purposes: ['Universal'],
    links: {
      websites: ['https://lisk.com/'],
      apps: ['https://bridge.lisk.com/bridge/lisk', 'https://portal.lisk.com/'],
      documentation: ['https://docs.lisk.com/'],
      explorers: ['https://blockscout.lisk.com/'],
      repositories: ['https://github.com/LiskHQ/lisk-node'],
      socialMedia: [
        'https://x.com/LiskHQ',
        'https://lisk.chat/',
        'https://reddit.com/r/lisk/',
        'https://facebook.com/LiskHQ',
        'https://linkedin.com/company/lisk',
        'https://instagram.com/lisk_blockchain',
        'https://t.me/Lisk_HQ',
        'https://youtube.com/channel/UCuqpGfg_bOQ8Ja4pj811PWg',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  usesBlobs: true,
  isNodeAvailable: true,
  rpcUrl: 'https://rpc.api.lisk.com',
  useDiscoveryMetaOnly: true,
})
