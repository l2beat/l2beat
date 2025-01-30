import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { underReviewL2 } from './templates/underReview'

export const nal: Layer2 = underReviewL2({
  id: 'nal',
  capability: 'universal',
  addedAt: new UnixTime(1726499832), // 2024-09-16T15:17:12Z
  display: {
    name: 'Nal',
    slug: 'nal',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    description:
      'Nal is a general-purpose OP stack chain. It aims to facilitate the creation and trading of new assets, including AIGC and physical-to-digital transformations.',
    purposes: ['Universal'],
    links: {
      websites: ['https://nal.network/#/home'],
      apps: [], //https://bridge.nal.network/deposit for testnet, no mainnet bridge UI is available yet
      documentation: ['https://docs.nal.network/chain/Overview.html'],
      explorers: ['https://scan.nal.network/'],
      socialMedia: ['https://x.com/nal_network'],
    },
  },
  rpcUrl: 'https://rpc.nal.network/',
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc.nal.network/',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x8a471dF117E2fEA79DACE93cF5f6dd4217931Db7'),
      sinceTimestamp: new UnixTime(1719457200),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
