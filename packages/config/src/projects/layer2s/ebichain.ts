import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { Badge } from '../badges'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const ebichain: Layer2 = underReviewL2({
  id: 'ebichain',
  createdAt: new UnixTime(1726563843), // 2024-09-17T09:04:03Z
  badges: [Badge.Stack.Orbit, Badge.VM.EVM, Badge.DA.DAC, Badge.RaaS.Conduit],
  display: {
    name: 'Ebi Chain',
    slug: 'ebichain',
    description:
      'Ebi Chain is a Layer-2 hosting the Ebi.xyz platform, a limit order book decentralised platform for trading perpetual futures.',
    purposes: ['Exchange'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://ebi.xyz/en/home/'],
      apps: ['https://ebi.xyz/en/trade/contract/'],
      documentation: ['https://docs.ebi.xyz/ebi.xyz-overview'],
      explorers: ['https://explorer.ebi.xyz/'],
      repositories: [],
      socialMedia: [
        'https://x.com/ebixyzdex',
        'https://t.me/ebixyzofficial',
        'https://discord.com/invite/ebixyz',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.ebi.xyz',
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.ebi.xyz',
    startBlock: 1,
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
  },
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0x73CF739b0233027cd516998e177d473D0a45E037'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1713462371),
      tokens: '*',
    },
  ],
})
