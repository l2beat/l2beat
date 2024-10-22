import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { Badge } from '../badges'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const race: Layer2 = underReviewL2({
  id: 'race',
  createdAt: new UnixTime(1726563843), // 2024-09-17T09:04:03Z
  badges: [Badge.Stack.OPStack, Badge.VM.EVM, Badge.DA.EthereumCalldata],
  display: {
    name: 'Race Network',
    slug: 'race',
    description:
      'Race Network is a Layer-2 designed for the tokenization and distribution of real-world assets (RWA).',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://raceecosystem.com/'],
      apps: [
        'https://bridge.race.foundation/',
        'https://raceecosystem.com/onboarding',
      ],
      documentation: [],
      explorers: [], // https://testnet.racescan.io/ testnet explorer only
      repositories: [],
      socialMedia: [
        'https://x.com/RACEecosystem',
        'https://facebook.com/RACEecosystem/',
        'https://linkedin.com/company/raceecosystem',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://racemainnet.io',
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://racemainnet.io',
    startBlock: 1,
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
  },
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0x680969A6c58183987c8126ca4DE6b59C6540Cd2a'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1720427195),
      tokens: '*',
    },
  ],
})
