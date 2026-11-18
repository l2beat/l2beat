import { ChainSpecificAddress, CoingeckoId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Token } from '../estimateTVL'
import { selectHeldTokens, toTokenAddresses } from './heldTokens'

const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

function token(symbol: string, address: string | undefined): Token {
  return {
    symbol,
    coingeckoId: CoingeckoId(symbol.toLowerCase()),
    decimals: 18,
    iconUrl: undefined,
    address:
      address === undefined
        ? undefined
        : ChainSpecificAddress.fromLong('ethereum', address),
  }
}

const TOKENS = [token('ETH', undefined), token('USDC', USDC), token('DAI', DAI)]

describe('toTokenAddresses', () => {
  it('leaves out the gas token, which has no contract', () => {
    expect(toTokenAddresses(TOKENS)).toEqual([
      ChainSpecificAddress.fromLong('ethereum', USDC),
      ChainSpecificAddress.fromLong('ethereum', DAI),
    ])
  })
})

describe('selectHeldTokens', () => {
  it('keeps the held tokens and the gas token', () => {
    const held = [ChainSpecificAddress.fromLong('ethereum', USDC)]

    const selected = selectHeldTokens(TOKENS, held)

    expect(selected.map((entry) => entry.symbol)).toEqual(['ETH', 'USDC'])
  })

  it('keeps only the gas token for a holder the index knows nothing of', () => {
    const selected = selectHeldTokens(TOKENS, [])

    expect(selected.map((entry) => entry.symbol)).toEqual(['ETH'])
  })
})
