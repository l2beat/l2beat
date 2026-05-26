import { expect } from 'earl'
import { getInteropTokenUrl } from './getInteropTokenUrl'

describe(getInteropTokenUrl.name, () => {
  it('returns undefined for unknown tokens', () => {
    const result = getInteropTokenUrl(
      { id: 'unknown', issuer: null, symbol: 'Unknown' },
      { from: ['ethereum'], to: ['arbitrum'] },
    )

    expect(result).toEqual(undefined)
  })

  it('builds token URL preserving selectedChains', () => {
    const result = getInteropTokenUrl(
      { id: 'usdc', issuer: 'circle', symbol: 'USDC' },
      { from: ['ethereum'], to: ['arbitrum'] },
    )

    expect(result).toEqual(
      '/interop/tokens/circle-usdc?selectedChains=ethereum%2Carbitrum',
    )
  })

  it('returns path without query when selection is not one pair', () => {
    const result = getInteropTokenUrl(
      { id: 'eth', issuer: null, symbol: 'ETH' },
      { from: ['ethereum', 'arbitrum'], to: ['base'] },
    )

    expect(result).toEqual('/interop/tokens/eth')
  })
})
