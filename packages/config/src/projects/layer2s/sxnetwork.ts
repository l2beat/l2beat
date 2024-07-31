import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const sxnetwork: Layer2 = underReviewL2({
  id: ProjectId('sxnetwork'),
  display: {
    category: 'Optimium',
    provider: 'Arbitrum',
    name: 'SX Network',
    slug: 'sxnetwork',
    description:
      "SX Network is an Orbit stack Optimium, built to scale the SX team's existing sports betting platform.",
    purposes: ['Betting'],
    links: {
      websites: ['https://sx.technology/'],
      apps: [
        'https://sx.bet/wallet/bridge',
        'https://bridge.gelato.network/bridge/sx-rollup',
      ],
      documentation: ['https://docs.sx.technology/'],
      explorers: ['https://explorerl2.sx.technology/'],
      repositories: [],
      socialMedia: [
        'https://x.com/SX_Network',
        'https://discord.com/invite/sxnetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['SX'],
  rpcUrl: 'https://rpc.sx-rollup.gelato.digital', //chainid 4162
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.sx-rollup.gelato.digital',
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
    startBlock: 1,
  },
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0xa104c0426e95a5538e89131dbb4163d230c35f86'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1686211235),
      tokens: '*',
    },
  ],
})
