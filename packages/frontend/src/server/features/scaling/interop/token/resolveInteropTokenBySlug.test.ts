import { expect } from 'earl'
import { resolveInteropTokenBySlug } from './resolveInteropTokenBySlug'

describe(resolveInteropTokenBySlug.name, () => {
  const tokens = [
    {
      id: 'usdc',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl: null,
      category: 'stablecoin',
    },
    {
      id: 'eth',
      symbol: 'ETH',
      issuer: null,
      iconUrl: null,
      category: 'ether',
    },
  ] as const

  it('resolves a valid slug to token data', () => {
    expect(resolveInteropTokenBySlug([...tokens], 'circle-usdc')).toEqual(
      tokens[0],
    )
  })

  it('returns undefined for an unknown slug', () => {
    expect(resolveInteropTokenBySlug([...tokens], 'missing')).toEqual(undefined)
  })
})
