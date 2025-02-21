import type { ProjectEscrow } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { mapTokens } from './BackendProject'

describe('BackendProject', () => {
  describe(mapTokens.name, () => {
    it('works for *', () => {
      const escrow = getMockEscrow({
        tokens: '*',
        excludedTokens: ['B'],
        premintedTokens: ['C'],
      })

      const tokensOnChain: Token[] = [
        getMockToken({ symbol: 'A' }),
        getMockToken({ symbol: 'B' }),
        getMockToken({ symbol: 'C' }),
      ]

      const tokens = mapTokens(escrow, tokensOnChain)

      expect(tokens).toEqualUnsorted([
        { ...getMockToken({ symbol: 'A' }), isPreminted: false },
        { ...getMockToken({ symbol: 'C' }), isPreminted: true },
      ])
    })
    it('works for list of symbols', () => {
      const escrow = getMockEscrow({
        tokens: ['A', 'B', 'C'],
        excludedTokens: ['B'],
        premintedTokens: ['C'],
      })

      const tokensOnChain: Token[] = [
        getMockToken({ symbol: 'A' }),
        getMockToken({ symbol: 'B' }),
        getMockToken({ symbol: 'C' }),
        getMockToken({ symbol: 'D' }),
      ]

      const tokens = mapTokens(escrow, tokensOnChain)

      expect(tokens).toEqualUnsorted([
        { ...getMockToken({ symbol: 'A' }), isPreminted: false },
        { ...getMockToken({ symbol: 'C' }), isPreminted: true },
      ])
    })
  })
})

const getMockToken = (token: Partial<Token>): Token => {
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
    chainName: 'ethereum',
    source: 'canonical',
    supply: 'zero',
    ...token,
  }
}
function getMockEscrow(escrow: Partial<ProjectEscrow>): ProjectEscrow {
  return mockObject<ProjectEscrow>({
    address: EthereumAddress.random(),
    tokens: '*',
    excludedTokens: [],
    chain: 'chain',
    sinceTimestamp: UnixTime.ZERO,
    ...escrow,
  })
}
