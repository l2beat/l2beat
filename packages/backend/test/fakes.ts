import { AssetId, CoingeckoId, EthereumAddress } from '@l2beat/common'

import { Token } from '../src/model'

export const fakeToken = (token?: Partial<Token>): Token => ({
  id: AssetId('fake-token'),
  coingeckoId: CoingeckoId('fake-token'),
  symbol: 'FKT',
  decimals: Math.floor(Math.random() * 20),
  address: EthereumAddress.random(),
  ...token,
})
