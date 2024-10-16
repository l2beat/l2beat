import { UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { Badge } from '../badges'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const xchain: Layer2 = underReviewL2({
  id: 'xchain',
  display: {
    name: 'XCHAIN',
    slug: 'xchain',
    category: 'Optimium',
    provider: 'Arbitrum',
    description:
      'XCHAIN is an Optimium based on the Arbitrum Orbit stack. It is built to support IDEX - a high-performance perpetual swaps exchange. It allows for gas free and nearly instant settlement of all IDEX transactions.',
    purposes: ['Universal'],
    links: {
      websites: ['https://idex.io/'],
      apps: ['https://exchange.idex.io/'],
      documentation: ['https://docs.idex.io/'],
      explorers: ['https://xchain-explorer.idex.io/'],
      repositories: [],
      socialMedia: [
        'https://x.com/idexio',
        'https://discord.com/invite/idex',
        'https://t.me/IDEXChat',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'xchain',
    chainId: 94524,
    explorerUrl: 'https://xchain-explorer.idex.io/',
    explorerApi: {
      url: 'https://xchain-explorer.idex.io/api',
      type: 'blockscout',
    },
    multicallContracts: [],
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-08-21T00:00:00Z')),
  },
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://xchain-rpc.idex.io/',
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
  },
  badges: [Badge.VM.EVM, Badge.Stack.Orbit, Badge.RaaS.Conduit],
  //using the Stargate v2 Hydra bridge, docs do not include the contracts yet
})
