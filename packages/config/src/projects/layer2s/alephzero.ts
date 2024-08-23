import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const alephzero: Layer2 = underReviewL2({
  id: 'alephzero',
  display: {
    name: 'Aleph Zero EVM',
    slug: 'aleph-zero',
    description:
      'Aleph Zero is an Optimium on Ethereum, built on the Orbit stack. It aims at enabling developers to build privacy-enhancing applications through zkOS, and provide advanced account abstraction capabilities.',
    purposes: ['Privacy'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://alephzero.org/'],
      apps: ['https://bridge.gelato.network/bridge/aleph-zero-evm'],
      documentation: ['https://docs.alephzero.org/'],
      explorers: ['https://evm-explorer.alephzero.org/'],
      repositories: ['https://github.com/Cardinal-Cryptography'],
      socialMedia: ['https://x.com/Aleph__Zero'],
    },
  },
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1722297600),
      tokens: '*',
    },
  ],
})
