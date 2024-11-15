import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('thebinaryholdings')

export const thebinaryholdings: Layer2 = opStackL2({
  createdAt: new UnixTime(1726668186), // 2024-09-18T14:03:06Z
  discovery,
  badges: [Badge.Infra.Superchain],
  display: {
    name: 'The Binary Holdings',
    slug: 'thebinaryholdings',
    shortName: 'Binary',
    description:
      'The Binary Holdings is a web3 infrastructure that integrates into telecommunication and banking apps to increase user engagement, retention, and ARPU (Average Revenue Per User) - while rewarding users for their engagement. It uses its own token (BNRY) for gas.',
    links: {
      websites: ['https://thebinaryholdings.com/'],
      apps: [],
      documentation: ['https://docs.thebinaryholdings.com/'],
      explorers: ['https://explorer.thebinaryholdings.com'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/thebinaryhldgs',
        'https://t.me/tbhofficialchat',
        'https://discord.gg/wCXJmTBGr2',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.zero.thebinaryholdings.com',
  genesisTimestamp: new UnixTime(1719397465),
  finality: {
    type: 'OPStack-blob',
    genesisTimestamp: new UnixTime(1719398651),
    minTimestamp: new UnixTime(1719397465),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled', // TODO(radomski): gives negatives results, investigate
  },
  isNodeAvailable: 'UnderReview',
  milestones: [],
  usesBlobs: true,
  discoveryDrivenData: true,
  nonTemplateOptimismPortalEscrowTokens: ['BNRY'],
})
