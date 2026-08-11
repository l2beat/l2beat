import { expect } from 'earl'
import { parseTokens } from './tokenBackend'

interface TestAbstractToken {
  symbol: string
  iconUrl: string | null
  coingeckoId: string | null
  deployedTokens: {
    chain: string
    address: string
    symbol: string
    decimals: number
  }[]
}

// The second entry is the chains procedure of the tRPC batch, which is ignored.
function toBody(abstractTokens: TestAbstractToken[]) {
  return [{ result: { data: { abstractTokens } } }, { result: { data: [] } }]
}

const ETHER: TestAbstractToken = {
  symbol: 'ETH',
  iconUrl: 'https://example.com/eth.png',
  coingeckoId: 'ethereum',
  deployedTokens: [
    { chain: 'ethereum', address: 'native', symbol: 'ETH', decimals: 18 },
    { chain: 'base', address: 'native', symbol: 'ETH', decimals: 18 },
  ],
}

const UNPRICED: TestAbstractToken = {
  symbol: 'NOPRICE',
  iconUrl: null,
  coingeckoId: null,
  deployedTokens: [
    { chain: 'ethereum', address: '0xabc', symbol: 'NOPRICE', decimals: 6 },
  ],
}

describe('parseTokens', () => {
  it('flattens deployed tokens onto their abstract token', () => {
    const tokens = parseTokens(toBody([ETHER]))

    expect(tokens).toEqual([
      {
        chain: 'ethereum',
        address: 'native',
        symbol: 'ETH',
        decimals: 18,
        coingeckoId: 'ethereum',
        iconUrl: 'https://example.com/eth.png',
      },
      {
        chain: 'base',
        address: 'native',
        symbol: 'ETH',
        decimals: 18,
        coingeckoId: 'ethereum',
        iconUrl: 'https://example.com/eth.png',
      },
    ])
  })

  // A token the backend cannot price is unusable here, but it must not cost us
  // every other token in the response.
  it('skips a token without a coingecko id and keeps the rest', () => {
    const tokens = parseTokens(toBody([UNPRICED, ETHER]))

    expect(tokens.map((token) => token.symbol)).toEqual(['ETH', 'ETH'])
  })

  it('reads an absent icon as undefined', () => {
    const priced = { ...UNPRICED, coingeckoId: 'no-price' }
    const tokens = parseTokens(toBody([priced]))

    expect(tokens.map((token) => token.iconUrl)).toEqual([undefined])
  })

  it('rejects a response it cannot read', () => {
    expect(() => parseTokens({ result: 'not a batch' })).toThrow()
    expect(() =>
      parseTokens(toBody([{ ...ETHER, symbol: 1 } as never])),
    ).toThrow()
  })
})
