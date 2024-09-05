import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from '../layer3s'

export const winr: Layer3 = underReviewL3({
  hostChain: ProjectId('arbitrum'),
  id: ProjectId('winr'),
  display: {
    category: 'Optimium',
    provider: 'Arbitrum',
    name: 'WINR',
    slug: 'winr',
    description:
      'WINR is a Layer 3 on Arbitrum, based on the Orbit stack. It is focused on building a decentralized iGaming infrastructure.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://winr.games/'],
      apps: [],
      documentation: [''],
      explorers: ['https://explorer.winr.games/'],
      repositories: [],
      socialMedia: ['https://x.com/WINRProtocol'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.winr.games ',
  associatedTokens: ['WINR'],
  escrows: [
    {
      chain: 'arbitrum',
      address: EthereumAddress('0xf3f01622ac969156760c32190995f9dc5b3eb7fa'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1715803200),
      tokens: '*',
    },
  ],
})
