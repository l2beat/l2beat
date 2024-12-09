import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER } from '../layer2s/templates/opStack'
import { opStackL3 } from '../layer2s/templates/opStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('b3', 'base')

export const b3: Layer3 = opStackL3({
  createdAt: new UnixTime(1722376845),
  hostChain: ProjectId('base'),
  additionalBadges: [
    Badge.DA.Celestia,
    Badge.RaaS.Caldera,
    Badge.L3ParentChain.Base,
  ],
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  additionalPurposes: ['Gaming'],
  display: {
    name: 'B3',
    slug: 'b3',
    architectureImage: 'B3',
    description:
      'B3 is an L3 built on Base to bring gamers and game creators onchain, powered by the OP Stack and Celestia DA.',
    links: {
      websites: ['https://b3.fun/'],
      apps: ['https://bridge.b3.fun/'],
      documentation: ['https://docs.b3.fun/'],
      explorers: ['https://explorer.b3.fun/'],
      repositories: [''],
      socialMedia: [
        'https://x.com/b3dotfun',
        'https://discord.com/invite/b3dotfun',
        'https://warpcast.com/b3dotfun',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'b3',
    chainId: 8333,
    explorerUrl: 'https://explorer.b3.fun/',
    explorerApi: {
      url: 'https://explorer.b3.fun/api/v2/',
      type: 'blockscout',
    },
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://mainnet-rpc.b3.fun/http',
    startBlock: 1,
    defaultCallsPerMinute: 800,
    assessCount: subtractOne,
  },
  genesisTimestamp: new UnixTime(1722378840),
  isNodeAvailable: false,
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'B3 Open Mainnet Launch',
      link: 'https://cryptoslate.com/press-releases/b3-fun-debuts-mainnet-with-record-breaking-367k-wallets-and-47m-transactions-in-just-1-month-of-testnet/',
      date: '2024-08-15T00:00:00.00Z',
      description: 'B3 opens the mainnet to the public.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Blobstream and Celestia Architecture',
      url: 'https://www.youtube.com/watch?v=cn_fN6pkakQ',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
})
