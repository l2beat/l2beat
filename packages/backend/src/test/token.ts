import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'

interface MockToken extends Token {
  address: EthereumAddress
}

export const getMockToken = (): MockToken => {
  return {
    name: 'Mock',
    id: AssetId('mock-token'),
    coingeckoId: CoingeckoId('mock-token'),
    symbol: 'MOCK',
    decimals: 18,
    address: EthereumAddress.ZERO,
    sinceTimestamp: new UnixTime(0),
    category: 'other',
    chainId: ChainId.ETHEREUM,
    type: ValueType.CBV,
  }
}
